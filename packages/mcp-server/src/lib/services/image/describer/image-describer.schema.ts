import z from "zod";

export const singleDescriptionSchema = z.object({
    imageDescription: z
        .string()
        .describe(
            "One single sentence describing what the image shows. Include main visible objects or symbols and any visible text or numbers exactly as shown. Do not include 'Image of', 'Photo of', or similar prefaces. Only mention text if clearly visible. Do not infer or guess text from context. Output format: only the sentence, nothing else."
        ),
});

export type SingleDescriptionResult = z.infer<typeof singleDescriptionSchema>;

export const multipleDescriptionSchema = z.object({
    descriptions: z.array(z.string()).length(4).describe("Exactly 4 distinct image descriptions, each capturing a different aspect"),
});

export type MultipleDescriptionResult = z.infer<typeof multipleDescriptionSchema>;
