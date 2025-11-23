import * as path from "node:path";
import fs from "node:fs";
import { z } from "zod";
import { render } from "mustache";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PromptExtraArgs = Record<string, any>;

export type PromptArgs = {
    promptName: UUV_PROMPT;
} | PromptExtraArgs;

export enum UUV_PROMPT {
    GENERATE_TEST_EXPECT_TABLE = "generate_test_expect_table",
    GENERATE_TEST_EXPECT_ELEMENT = "generate_test_expect_element",
}


export class PromptRetrieverService {
    private static loadPromptTemplate(promptName: string): string {
        const templatePath = path.join(__dirname, "..", "prompts", `${promptName}.mustache`);
        return fs.readFileSync(templatePath, "utf8");
    }

    private static generatePrompt(args: PromptArgs): string {
        const template = this.loadPromptTemplate(args.promptName);
        return render(template, args);
    }

    private static validatePromptGenerationRequest(args: PromptArgs) {
        const promptSchemas = z.discriminatedUnion("promptName", [
            z.object({
                promptName: z.literal(UUV_PROMPT.GENERATE_TEST_EXPECT_TABLE),
                baseUrl: z.string().describe("The base URL of the page where the table/grid/treegrid is located."),
            }),
            z.object({
                promptName: z.literal(UUV_PROMPT.GENERATE_TEST_EXPECT_ELEMENT),
                baseUrl: z.string().describe("The base URL of the page where the element is located."),
                accessibleName: z.string().optional().describe("Accessible name of the element"),
                accessibleRole: z.string().optional().describe("Accessible role of the element"),
                domSelector: z.string().optional().describe("Dom selector of the element"),
            }),
        ]).superRefine((data, ctx) => {
            if (data.promptName === UUV_PROMPT.GENERATE_TEST_EXPECT_ELEMENT) {
                const hasAccessibleSelector = data.accessibleRole && data.accessibleName;
                const hasDomSelector = data.domSelector;

                if (!hasAccessibleSelector && !hasDomSelector) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: "You must provide either (accessibleRole AND accessibleName) or domSelector",
                    });
                }
            }
        });

        return promptSchemas.parse(args);
    }

    public static retrievePrompt(args: PromptArgs) {
        const validatedPrompt = PromptRetrieverService.validatePromptGenerationRequest(args);
        let prompt: string;
        switch (validatedPrompt.promptName) {
            case UUV_PROMPT.GENERATE_TEST_EXPECT_TABLE:
                prompt = PromptRetrieverService.generatePrompt(args);
                break;

            case UUV_PROMPT.GENERATE_TEST_EXPECT_ELEMENT:
                prompt = PromptRetrieverService.generatePrompt(args);
                break;

            default:
                throw new Error(`Bad parameters for request ${args}`);
        }
        return prompt;
    }
}
