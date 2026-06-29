import { generateText, LanguageModel, Output, zodSchema } from "ai";
import { JSDOM } from "jsdom";
import { ClassificationResult, ClassificationResultSchema, ClassifyImageComputedInput, ClassifyImageInput } from "./image-classifier.schema";
import { logger } from "../../utils";

export class ImageClassifierService {
    constructor(private model: LanguageModel) {}

    protected getSystemPrompt(): string {
        return `You are an automated image classifier with accessibility awareness.

You MUST always follow this process in order:
1. Analyze the image content shown as described
2. Evaluate surrounding context: Text before image and text after image
3. Use ChainOfThought reasoning: First analyze the visual elements, then determine purpose, finally classify as decorative or informative
   - Visual analysis: Identify objects, text, colors, patterns, people, or scenes
   - Context analysis: Check if surrounding text refers to the image and what its intent is
   - Decision: Combine visual and context to determine if decorative or informative
4. Return classification result with confidence level

Classification criteria:
- INFORMATIVE (is_decorative=false) when:
  * Image is explicitly referenced in surrounding text and provides additional information → confidence +0.6
  * Image content alone conveys a message, tutorial, or call to action → confidence +0.45

- DECORATIVE (is_decorative=true) when:
  * Image is NOT referenced in surrounding text → confidence +0.3
  * Image content alone does not convey a message or call to action → confidence +0.6

Confidence levels:
- High (0.8-1.0): Clear decorative (pure patterns) or obvious informative content
- Medium (0.5-0.79): Some ambiguity but leaning toward classification
- Low (0.0-0.49): Significant uncertainty, may need review`;
    }

    public async classify(input: ClassifyImageInput): Promise<ClassificationResult> {
        try {
            const computedInput: ClassifyImageComputedInput = this.extractImageContext(input);
            const result = await generateText({
                model: this.model,
                system: this.getSystemPrompt(),
                messages: [{ role: "user", content: JSON.stringify(computedInput) }],
                temperature: 0.0,
                output: Output.object({ schema: zodSchema(ClassificationResultSchema) }),
            });

            return result.output;
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
                    textBefore: "",
                    textAfter: "",
                    cleanedHtml: this.removeAccessibilityAttributes(input.htmlContent),
                    imageDescription: input.imageDescription,
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
                textBefore: textBefore,
                textAfter: textAfter,
                cleanedHtml: this.removeAccessibilityAttributes(input.htmlContent),
                imageDescription: input.imageDescription,
            };
        } catch (error) {
            logger.error({ error }, "Error extracting image context");
            return {
                textBefore: "",
                textAfter: "",
                cleanedHtml: input.htmlContent,
                imageDescription: input.imageDescription,
            };
        }
    }
}
