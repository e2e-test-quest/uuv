import { generateText, LanguageModel, Output, zodSchema } from "ai";
import { btoa, File } from "node:buffer";
import { logger } from "../../utils";
import { MultipleDescriptionResult, multipleDescriptionSchema, SingleDescriptionResult, singleDescriptionSchema } from "./image-describer.schema";

export class ImageDescriberService {
    constructor(private model: LanguageModel) {}

    protected getSystemPromptForUniqueDescription(): string {
        return `You are an expert at describing images precisely and objectively.

Describe in one single sentence what the image shows and include:
- The main visible objects or symbols
- Any visible text or numbers, transcribed exactly as shown

STRICT RULES for text:
- Only mention text or numbers if you clearly see them in the image
- If there is no text, do not say there is any
- Do not count the same word twice
- Do not infer or guess text from context. Only use what is clearly readable
- If the text is partially cut or blurred, transcribe exactly what is readable

Other constraints:
- Do not include "Image of", "Photo of", or similar prefaces
- Do not interpret the purpose or meaning of the image
- Be concise, neutral, and factual

Output format: only the sentence, nothing else.`;
    }

    protected getSystemPromptForMultipleDescription(): string {
        return `You are an expert at describing images precisely and objectively.

Provide **4 different possible sentence descriptions** of what the image shows.
Each description should capture a different aspect or perspective of the image:
- One focusing on the main subjects and actions
- One focusing on visual details (colors, patterns, textures)
- One focusing on the context and setting
- One focusing on the mood and atmosphere

STRICT RULES:
- Each description must be a single, concise sentence
- Do not include "Image of", "Photo of", or similar prefaces
- Be neutral, factual, and objective
- Only mention text or numbers if clearly visible in the image
- Do not infer or guess text from context

Output format: return exactly 4 descriptions as an array of strings.`;
    }

    public async singleDescribe(imageData: File | ArrayBuffer): Promise<SingleDescriptionResult> {
        try {
            const imageToSend = await this.buildImageToSend(imageData);

            const result = await generateText({
                model: this.model,
                system: this.getSystemPromptForUniqueDescription(),
                messages: [
                    {
                        role: "user",
                        content: [
                            { type: "text", text: "Describe this image" },
                            {
                                type: "image",
                                image: imageToSend,
                            },
                        ],
                    },
                ],
                temperature: 1.0,
                output: Output.object({ schema: zodSchema(singleDescriptionSchema) }),
            });

            return result.output;
        } catch (error) {
            logger.error({ error }, "Error in ImageDescriberService.describe");
            throw new Error(`Failed to describe image: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    public async multipleDescribe(imageData: File | ArrayBuffer): Promise<MultipleDescriptionResult> {
        try {
            const imageToSend = await this.buildImageToSend(imageData);

            const result = await generateText({
                model: this.model,
                system: this.getSystemPromptForMultipleDescription(),
                messages: [
                    {
                        role: "user",
                        content: [
                            { type: "text", text: "Describe this image with 4 distinct descriptions." },
                            {
                                type: "image",
                                image: imageToSend,
                            },
                        ],
                    },
                ],
                temperature: 1.0,
                output: Output.object({ schema: zodSchema(multipleDescriptionSchema) }),
            });

            return result.output;
        } catch (error) {
            logger.error({ error }, "Error in ImageDescriberService.describe");
            throw new Error(`Failed to describe image: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    private async buildImageToSend(imageData: File | ArrayBuffer) {
        let imageContent = imageData;
        if (imageData instanceof File) {
            imageContent = await imageData.arrayBuffer();
        }
        return typeof imageContent === "string" ? imageContent : "data:image/jpeg;base64," + this.bufferToBase64(imageContent as ArrayBuffer);
    }

    private bufferToBase64(buffer: ArrayBuffer): string {
        let binary = "";
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }
}
