import { Eval, EvalScorer, initLogger } from "braintrust";
import { ClassificationResult, ImageClassifierService } from "../services/image";
import { Factuality } from "autoevals";
import OpenAI from "openai";
import { readFileSync } from "fs";
import { getEmbeddingModelFor, getLanguageModel } from "../services/utils";
import { ClassifyImageInput } from "../services/image/classifier/image-classifier.schema";
import path from "path";

const llmModel = "ministral-3:8b";
const fullLlmModel = `ollama/${llmModel}`;
const llmApi = "http://localhost:11434";

describe("UuvAgentEval", () => {
    describe("Image", () => {
        describe("Classifier", () => {
            it("should have a good evaluation scores", async () => {
                // eslint-disable-next-line dot-notation
                process.env["OPENAI_API_KEY"] = "-";
                // eslint-disable-next-line dot-notation
                process.env["BRAINTRUST_API_KEY"] = "-";

                const evaluationDataset: EvalCase[] = JSON.parse(readFileSync(path.join(__dirname, "image-evaluation-dataset.json"), "utf-8"));

                const model = getLanguageModel(fullLlmModel, llmApi);
                const embeddingConfig = getEmbeddingModelFor(fullLlmModel, llmApi);
                const classifierService = new ImageClassifierService(model, embeddingConfig);

                const result = await Eval("UUV Assistant AI", {
                    data: evaluationDataset.map(row => ({
                        input: {
                            htmlContent: row.htmlContent,
                            imageCssSelector: row.cssSelector,
                            imageDescription: row.imageDescription,
                        },
                        expected: row.expectations,
                        metadata: { name: row.name },
                    })),
                    task: input => classifierService.classify(input),
                    scores: [isDecorativeScorer, confidenceScorer, analysisDetailsCorrectnessScorer],
                    maxConcurrency: 1,
                });

                console.dir(result.summary);
            }, 10 * 60 * 1000);
        });
    });
});

type ExpectedOutput = Omit<ClassificationResult, "imageDescription">;
type EvalCase = {
    name: string;
    htmlContent: string;
    cssSelector: string;
    imageUrl: string;
    imageDescription: string;
    expectations: ExpectedOutput;
};
const isDecorativeScorer: EvalScorer<ClassifyImageInput, ClassificationResult, ExpectedOutput, { name: string }> = ({ output, expected }) => {
    return {
        name: "is_decorative_score",
        score: output?.isDecorative === expected.isDecorative ? 1 : 0,
        metadata: { actual: output.isDecorative, expected: expected.isDecorative },
    };
};

const confidenceScorer: EvalScorer<ClassifyImageInput, ClassificationResult, ExpectedOutput, { name: string }> = ({ output, expected }) => {
    return {
        name: "confidence_score",
        score: 1 - Math.abs(expected.confidence - output.confidence),
        metadata: { actual: output.confidence, expected: expected.confidence },
    };
};

const analysisDetailsCorrectnessScorer: EvalScorer<ClassifyImageInput, ClassificationResult, ExpectedOutput, { name: string }> = async ({
    input,
    output,
    expected,
}) => {
    const result = await Factuality({
        model: llmModel,
        client: new OpenAI({
            baseURL: `${llmApi}/v1/`,
        }),
        input: input.imageDescription,
        output: output.analysisDetails,
        expected: expected.analysisDetails,
    });
    return {
        name: "analysis_correctness",
        score: result.score ?? 0,
    };
};


