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
    isDecorative: z
        .boolean()
        .describe(
            "Based solely on the calculation in scorescore: false if the calculated score >= 0.6 (meaning informative), else true (meaning decorative)"
        ),

    confidence: z
        .number()
        .min(0)
        .max(1)
        .describe(
            `How reliable this classification is, independent of the score value. This reflects the clarity and consistency of the evidence, not the weighted total.
            High (0.80-0.95): the image description and the surrounding text clearly point the same way, with no contradictory signals (e.g. obvious pure pattern with no reference in the text, or an explicit call-to-action element directly discussed in the text).
            Medium (0.5-0.75): the evidence leans one way but one signal is missing, weak, or only partially clear (e.g. surrounding text is vague, or the image description is ambiguous about intent).
            Low (0.0-0.49): the image description and the surrounding text give conflicting or insufficient signals, making the classification uncertain and worth a human review.`
        ),

    analysisDetails: z.string().max(500).describe(`
            Describe in one sentence what the image shows, then explain in one or two sentences the connection (or lack of connection) with the surrounding text, concluding naturally whether the image adds useful information or serves purely as decoration            
            Example (decorative): "The image shows an abstract geometric pattern used purely as visual separation. It contains no text, icons, or objects that convey information, and the surrounding text does not mention it."
            Example (informative): "The image shows a Register button. The preceding text discusses registration and refers the reader to step 2 below, confirming the image adds actionable information."
        `),
});

/**
 * Complete classification result type
 */
export type ClassificationResult = z.infer<typeof ClassificationResultSchema> & {
    imageDescription: string;
};

/**
 * Complete classification input
 * Uses snake_case to match the Java/Python convention and avoid hydration issues
 */
export const ClassifyImageComputedInputSchema = z.object({
    /** Cleaned HTML */
    textBefore: z.string().describe("Text content before image in the HTML page"),

    /** Cleaned HTML */
    textAfter: z.string().describe("Text content after image in the HTML page"),

    /** Image description from vision model */
    imageDescription: z.string().describe("Description of the image as returned by a vision model"),

    /** Css selector the image in HTML */
    imageCssSelector: z.string().describe("Css selector that help to localised image to classify"),
});

/**
 * Complete classification result type
 */
export type ClassifyImageComputedInput = z.infer<typeof ClassifyImageComputedInputSchema>;

export type ClassifyImageInput = Omit<ClassifyImageComputedInput, "textBefore" | "textAfter"> & {
    htmlContent: string;
};

export const SimilaritySchema = z.object({
    similarityScore: z
        .number()
        .describe(
            "Similarity score between surrounding text and image description"
        ),

    relation: z
        .enum(["sameSubject", "relatedTheme", "looseLink", "unrelated"])
        .describe(
            "sameSubject: image and text concern the same subject or event, even if details differ. " +
                "relatedTheme: same general domain but different specific subjects. " +
                "looseLink: only a vague or incidental connection. " +
                "unrelated: nothing in common."
        ),

    confidence: z.number().describe(
        "Confidence about the similarity Score"
    ),

    details: z
        .string()
        .max(500)
        .describe(
            "One short plain paragraph (max 400 characters) saying what the image shows that the text " +
                "does or does not already say. No lists, no markdown, no numbers."
        ),
});

export type Similarity = z.infer<typeof SimilaritySchema>;
