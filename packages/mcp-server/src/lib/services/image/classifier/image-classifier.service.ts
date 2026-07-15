import { JSDOM } from "jsdom";
import { ClassificationResult, ClassificationResultSchema, ClassifyImageComputedInput, ClassifyImageInput } from "./image-classifier.schema";
import { logger } from "../../utils";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { HumanMessage, SystemMessage } from "langchain";

export class ImageClassifierService {
    constructor(private readonly model: BaseChatModel) {}

    protected getSystemPrompt(): string {
        return `You are an automated image classifier with accessibility awareness.

## Classification criteria:
    ### STEP 1: Base score
        - Start at base score = 0.50 (neutral).

    ### STEP 2: Evaluate ALL applicable criteria and sum weights:

        #### DECORATIVE indicators (subtract from base):
            - Strong ornamental: pattern, border, separator, pure decoration → -0.30
            - Neutral textual reference only ("see below", "see figure") without added info → -0.25
            - Absolute redundancy: image shows exactly what the text already states → -0.25
            - Zero semantic link between text and image → -0.10
        
        #### INFORMATIVE indicators (add to base):
            - Spatial/structural information (diagram, chart, plan) conveying layout instantly → +0.35
            - Visual proof: screenshot/graphic demonstrating something not in text → +0.30
            - Self-contained visual message adding objective value beyond text with identifiable piece of information → +0.25
            - Unstated intent made visible by image → +0.20
            
        #### INFORMATIVE indicators (add to base), each requires citing the exact supporting words:
            - Spatial/structural information (diagram, chart, plan) explicitly described in image_description as conveying layout or data → +0.35
            - Visual proof: image_description explicitly describes a screenshot or graphic demonstrating a specific fact or result → +0.30
            - image_description explicitly describes a self-contained message (visible text, labeled diagram, explicit instruction) → +0.25
            - The surrounding text explicitly names or refers to what the image shows (e.g. "see the button below", "as shown in the diagram") → +0.20


    ### STEP 3: Calculate final scoring_reasoning
        -  compute scoring_reasoning score with the formula: scoring_reasoning = base score (0.50) + sum of all applicable weights

    ### STEP 4: Determine is_decorative
        - If score >= 0.60 → decorative status is INFORMATIVE (is_decorative = false)
        - If score < 0.60 → decorative status is DECORATIVE (is_decorative = true)

    If NO criteria clearly apply, add -0.10 to scoring_reasoning.
    
    ## JSON Output Field Instructions:
    Your response must be a JSON object containing the fields specified in the schema. You must strictly follow these instructions for each field:
        - "confidence" (number):
            - A number between 0.0 and 0.95 indicating the reliability of this classification.
    
        - "analysis_details" (string):
           - Clear explanation, in plain everyday language, aimed at a non-technical colleague, justifying why the image is decorative or informative.
           - REQUIRED FORMAT: a single continuous plain-text paragraph, **maximum 500 characters**.
           - STRICT PROHIBITIONS:
             * NO bullet points, dashes, numbered lists, *bold**, *italics*, or asterisks
             * NO headers or labels (like "Step-by-Step Evaluation:", "Category X:", "1.", etc.)
             * NO colons used as list separators
             * NO numbers, percentages, scores, weights, calculations, or references to "base score", "criteria", or "confidence value"
`;
    }

    public async classify(input: ClassifyImageInput): Promise<ClassificationResult> {
        try {
            const computedInput: ClassifyImageComputedInput = this.extractImageContext(input);
            const result = await this.model.withStructuredOutput(ClassificationResultSchema).invoke([
                new SystemMessage(this.getSystemPrompt()),
                new HumanMessage(
                    JSON.stringify({
                        cleanedHtml: computedInput.cleanedHtml,
                        imageDescription: input.imageDescription,
                        imageCssSelector: input.imageCssSelector,
                    })
                ),
            ]);

            const formatText = (text: string) => {
                return text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\*(.+?)\*/g, "<em>$1</em>");
            };

            return {
                image_description: input.imageDescription,
                ...result,
                analysis_details: formatText(result.analysis_details),
            };
        } catch (error) {
            logger.error({ error }, "Error in ImageClassifierService.classify");
            throw new Error(`Failed to classify image: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    private removeAccessibilityAttributes(htmlContent: string): string {
        let cleaned = htmlContent.replace(/\s+aria-[a-zA-Z-]+="[^"]*"/g, "");
        cleaned = cleaned.replace(/\s+alt="[^"]*"/g, "");
        return cleaned;
    }

    private extractImageContext(input: ClassifyImageInput): ClassifyImageComputedInput {
        try {
            const dom = new JSDOM(input.htmlContent);
            const document = dom.window.document;

            // Find image by CSS selector
            const img = document.querySelector(input.imageCssSelector);
            if (!img) {
                return {
                    cleanedHtml: this.removeAccessibilityAttributes(input.htmlContent),
                    imageDescription: input.imageDescription,
                    imageCssSelector: input.imageCssSelector,
                };
            }

            // Extract text before image (reverse walk)
            const wordsBefore: string[] = [];
            let currentElement = img.previousElementSibling;
            let wordLimit = 100;

            while (currentElement && wordsBefore.length < wordLimit) {
                const text = currentElement.textContent?.trim() || "";
                if (text) {
                    const words = text.split(/\s+/);
                    wordsBefore.unshift(...words);
                }
                if (!currentElement.previousElementSibling && currentElement.parentNode && currentElement.parentNode !== document.body) {
                    currentElement = currentElement.parentNode as Element;
                    const parentText = currentElement.textContent?.trim() || "";
                    if (parentText && wordsBefore.length < wordLimit) {
                        const parentWords = parentText.split(/\s+/);
                        wordsBefore.unshift(...parentWords);
                    }
                } else {
                    currentElement = currentElement.previousElementSibling;
                }
            }
            const textBefore = wordsBefore.slice(0, wordLimit).join(" ");

            // Extract text after image (forward walk)
            const wordsAfter: string[] = [];
            currentElement = img.nextElementSibling;
            wordLimit = 100;

            while (currentElement && wordsAfter.length < wordLimit) {
                const text = currentElement.textContent?.trim() || "";
                if (text) {
                    wordsAfter.push(...text.split(/\s+/));
                }
                if (!currentElement.nextElementSibling && currentElement.parentNode && currentElement.parentNode !== document.body) {
                    currentElement = currentElement.parentNode as Element;
                    const parentText = currentElement.textContent?.trim() || "";
                    if (parentText && wordsAfter.length < wordLimit) {
                        wordsAfter.push(...parentText.split(/\s+/));
                    }
                } else {
                    currentElement = currentElement.nextElementSibling;
                }
            }
            const textAfter = wordsAfter.slice(0, wordLimit).join(" ");

            return {
                imageCssSelector: input.imageCssSelector,
                cleanedHtml: this.removeAccessibilityAttributes(input.htmlContent),
                imageDescription: input.imageDescription,
            };
        } catch (error) {
            logger.error({ error }, "Error extracting image context");
            return {
                imageCssSelector: input.imageCssSelector,
                cleanedHtml: input.htmlContent,
                imageDescription: input.imageDescription,
            };
        }
    }
}
