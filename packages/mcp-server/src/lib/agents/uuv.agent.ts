import { LanguageModel } from "ai";
import { ClassificationResult, ImageClassifierService, ImageDescriberService } from "../services/image";
import { File } from "node:buffer";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";
import { getLanguageModel, logger } from "../services/utils";
import { Observable } from "rxjs";

export class UuvAgent {
    private describerService!: ImageDescriberService;
    private classifierService!: ImageClassifierService;
    private server?: Hono;
    private readonly model!: LanguageModel;

    constructor(private readonly llmModel: string, private readonly llmApi?: string) {
        logger.debug(`Parameters: [ llmModel: ${llmModel}, llmApi: ${llmApi} ]`);
        this.model = getLanguageModel(llmModel, llmApi);
        this.describerService = new ImageDescriberService(this.model);
        this.classifierService = new ImageClassifierService(this.model);
    }

    public async start() {
        this.server = new Hono();

        this.server.use(
            "/*",
            cors({
                origin: "*",
                allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
                allowHeaders: ["*"],
                credentials: true,
            })
        );

        this.server.get("/health", c =>
            c.json({
                status: "ok",
                llmModel: this.llmModel,
                llmApi: this.llmApi,
            })
        );

        this.server.post("/api/v1/image/classify-unified", async c => {
            const formData = await c.req.formData();

            const htmlContent = formData.get("html_content") || "";
            const cssSelector = formData.get("css_selector") || "";

            if (!htmlContent || !cssSelector) {
                return c.json({ error: "html_content and css_selector are required" }, 400);
            }

            const targetImgFile = formData.get("target_img_file");

            if (!(targetImgFile instanceof File)) {
                return c.json({ error: "target_img_file is required" }, 400);
            }

            const encoder = new TextEncoder();
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            const self = this;

            return new Response(
                new ReadableStream({
                    start(controller) {
                        logger.debug("stream created");

                        const subscription = self.unifiedClassifyImage(htmlContent.toString(), targetImgFile, cssSelector.toString()).subscribe({
                            next: progress => {
                                logger.debug(`write into stream: ${JSON.stringify(progress)}`);
                                controller.enqueue(encoder.encode(`${JSON.stringify(progress)}\n`));
                            },
                            error: err => {
                                logger.error(`An error occured: ${JSON.stringify(err)}`);
                                controller.error(err);
                            },
                            complete: () => {
                                logger.debug("Complete");
                                controller.close();
                            },
                        });

                        return () => {
                            logger.error("Stream cancelled by client");
                            subscription.unsubscribe();
                        };
                    },
                }),
                {
                    headers: {
                        "Content-Type": "application/x-ndjson",
                        "X-Accel-Buffering": "no",
                        "Cache-Control": "no-cache",
                    },
                }
            );
        });

        this.server.post("/api/v1/image/multiple-describe", async c => {
            const formData = await c.req.formData();

            const targetImgFile = formData.get("target_img_file");

            if (!(targetImgFile instanceof File)) {
                return c.json({ error: "target_img_file is required" }, 400);
            }

            const result = await this.describerService.multipleDescribe(targetImgFile);
            return c.json(result.descriptions);
        });

        this.server.post("/api/v1/image/classify", async c => {
            const formData = await c.req.formData();

            const htmlContent = formData.get("html_content") || "";
            const cssSelector = formData.get("css_selector") || "";
            const imageDescription = formData.get("image_description") || "";

            if (!htmlContent || !cssSelector || !imageDescription) {
                return c.json({ error: "html_content, css_selector and image_description are required" }, 400);
            }

            const result = await this.classifierService.classify({
                imageDescription: imageDescription.toString(),
                imageCssSelector: cssSelector.toString(),
                htmlContent: htmlContent.toString(),
            });
            return c.json(result);
        });

        logger.debug("Starting UUV ai agent agent...");

        serve({
            fetch: this.server!.fetch,
            port: 8000,
        });
        logger.debug("UUV ai agent agent started");
    }

    public unifiedClassifyImage(htmlContent: string, imageToClassify: File, imageCssSelector: string): Observable<Partial<ClassificationResult>> {
        logger.debug(
            `Unified classify image: { htmlContent: ${htmlContent}, imageToClassify: ${imageToClassify}, imageCssSelector: ${imageCssSelector}}`
        );

        return new Observable<Partial<ClassificationResult>>(subscriber => {
            (async () => {
                try {
                    const descriptionResult = await this.describerService.singleDescribe(imageToClassify);
                    subscriber.next({ image_description: descriptionResult.imageDescription });
                    logger.debug(`descriptionResult: ${JSON.stringify(descriptionResult)}`);

                    const result = await this.classifierService.classify({
                        htmlContent,
                        imageCssSelector,
                        imageDescription: descriptionResult.imageDescription,
                    });
                    logger.debug(`result: ${JSON.stringify(result)}`);
                    subscriber.next(result);
                    subscriber.complete();
                } catch (error) {
                    subscriber.error(error);
                }
            })();
        });
    }
}
