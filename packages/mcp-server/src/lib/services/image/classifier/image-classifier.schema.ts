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
    score: z
        .string()
        .describe(
            "Internal step-by-step calculation following the STEP 1-4 method: base score, each applicable criterion with its weight, sum, final score. Technical and numeric. This field is internal only and never shown to end users."
        ),

    is_decorative: z
        .boolean()
        .describe(
            "Based solely on the calculation in scorescore: false if the calculated score >= 0.6 (meaning informative), else true (meaning decorative)"
        ),

    confidence: z
        .number()
        .min(0)
        .max(0.95)
        .describe(
            `How reliable this classification is, independent of the score value. This reflects the clarity and consistency of the evidence, not the weighted total.
            High (0.80-0.95): the image description and the surrounding text clearly point the same way, with no contradictory signals (e.g. obvious pure pattern with no reference in the text, or an explicit call-to-action element directly discussed in the text).
            Medium (0.5-0.75): the evidence leans one way but one signal is missing, weak, or only partially clear (e.g. surrounding text is vague, or the image description is ambiguous about intent).
            Low (0.0-0.49): the image description and the surrounding text give conflicting or insufficient signals, making the classification uncertain and worth a human review.`
        ),

    analysis_details: z.string().max(500).describe(`
            Describe in one sentence what the image shows, then explain in one or two sentences the connection (or lack of connection) with the surrounding text, concluding naturally whether the image adds useful information or serves purely as decoration            
            Example (decorative): "The image shows an abstract geometric pattern used purely as visual separation. It contains no text, icons, or objects that convey information, and the surrounding text does not mention it."
            Example (informative): "The image shows a Register button. The preceding text discusses registration and refers the reader to step 2 below, confirming the image adds actionable information."
        `),
});

/**
 * Complete classification result type
 */
export type ClassificationResult = z.infer<typeof ClassificationResultSchema> & {
    image_description: string;
};

/**
 * Complete classification input
 * Uses snake_case to match the Java/Python convention and avoid hydration issues
 */
export const ClassifyImageComputedInputSchema = z.object({
    /** Cleaned HTML */
    cleanedHtml: z.string().describe("HTML with accessibility attributes removed"),

    /** Image description from vision model */
    imageDescription: z.string().describe("Description of the image as returned by a vision model"),

    /** Css selector the image in HTML */
    imageCssSelector: z.string().describe("Css selector that help to localised image to classify"),
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
