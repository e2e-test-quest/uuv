/**
 * Zod schemas for image classifier service (Phase 4)
 * Matches Python model.py schemas and ChainOfThought reasoning
 */

import z from "zod";

/**
 * Complete classification result with detailed analysis
 * Matches Python SignatureImageClassifier output
 */
export const ClassificationResultSchema = z.object({
    // Input: image description
    image_description: z.string().describe(
        "Description of the image as returned by a vision model: one objective sentence mentioning objects, symbols, and visible text"
    ),

    // Output: classification results
    is_decorative: z.boolean().describe(
        "Extract image's surrounding text, then determine if the image is decorative using image description and the image's surrounding text. Analyze the relationship between the image description and the surrounding text. False (informative) if: The surrounding text refers to the image AND the image provides additional information: add 0.6 to confidence. The image description alone refers to a message, a tutorial or call to action (text, objects, people, scenes): add 0.45 to confidence. True (decorative) if: The surrounding text doesn't refer to the image: add 0.3 to confidence. The image alone does not seem to convey a message or call to action: add 0.6 to confidence"
    ),

    confidence: z.number().min(0).max(1).describe(
        "Confidence score for the classification decision (0.0 to 1.0). High confidence (0.8-1.0): Clear decorative elements (pure patterns) or obvious informative content (text, diagrams, specific objects). Medium confidence (0.5-0.79): Some ambiguity but leaning toward classification. Low confidence (0.0-0.49): Significant uncertainty, classification may need review"
    ),

    analysis_details: z.string().max(500).describe("Single concise paragraph (2-3 sentences max) justifying the 'is_decorative' value. Format rules: One paragraph only (no bullet points, no list, no structure labels). Concise, clear, factual. Must include: 1) brief visual description, 2) brief reference (or absence of reference) from surrounding text, 3) final decision rationale. Examples: Image contains a call to action figure. The image is referenced in the text as \"see following image\" which suggests it is informative and not purely decorative. Image shows a decorative pattern with no text or objects conveying a message. The surrounding text does not refer to the image, indicating it is purely decorative."),
});

/**
 * Complete classification result type
 */
export type ClassificationResult = z.infer<typeof ClassificationResultSchema>;

/**
 * Complete classification input
 * Uses snake_case to match the Java/Python convention and avoid hydration issues
 */
export const ClassifyImageComputedInputSchema = z.object({
    /** Image description from vision model */
    imageDescription: z.string().describe("Description of the image as returned by a vision model"),

    /** Text before the image in HTML */
    textBefore: z.string().describe("Extracted text from HTML page before the image"),

    /** Text after the image in HTML */
    textAfter: z.string().describe("Extracted text from HTML page after the image"),

    /** Cleaned HTML */
    cleanedHtml: z.string().describe("HTML with accessibility attributes removed"),
});

/**
 * Complete classification result type
 */
export type ClassifyImageComputedInput = z.infer<typeof ClassifyImageComputedInputSchema>;

export type ClassifyImageInput = {
    htmlContent: string;
    imageDescription: string;
    imageCssSelector: string;
}
