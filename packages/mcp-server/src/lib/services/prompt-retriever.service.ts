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
    GENERATE_TEST_CLICK_ELEMENT = "generate_test_click_element",
    GENERATE_TEST_WITHIN_ELEMENT = "generate_test_within_element",
    GENERATE_TEST_TYPE_ELEMENT = "generate_test_type_element"
}

export const uuvPrompts = {
    [UUV_PROMPT.GENERATE_TEST_EXPECT_TABLE]: {
        title: "GenerateTestExpectTable",
        description: "Prompt to generate test for html table or grid or treeGrid"
    },
    [UUV_PROMPT.GENERATE_TEST_EXPECT_ELEMENT]: {
        title: "GenerateTestExpectElement",
        description: "Prompt to generate test that expects of html element with (role and name) or domSelector"
    },
    [UUV_PROMPT.GENERATE_TEST_CLICK_ELEMENT]: {
        title: "GenerateTestClickElement",
        description: "Prompt to generate test that clicks on html element with (role and name) or domSelector"
    },
    [UUV_PROMPT.GENERATE_TEST_WITHIN_ELEMENT]: {
        title: "GenerateTestWithinElement",
        description: "Prompt to generate test that focus within an html element with (role and name) or domSelector"
    },
    [UUV_PROMPT.GENERATE_TEST_TYPE_ELEMENT]: {
        title: "GenerateTestTypeElement",
        description: "Prompt to generate test that types a value into html element with (role and name) or domSelector"
    }
};

export const UUVPromptInputSchema = z.discriminatedUnion("promptName", [
    z.object({
        promptName: z.literal(UUV_PROMPT.GENERATE_TEST_EXPECT_TABLE),
        baseUrl: z.string().describe("The base URL of the page where the table/grid/treegrid is located."),
    }),
    z.object({
        promptName: z.enum([
            UUV_PROMPT.GENERATE_TEST_EXPECT_ELEMENT,
            UUV_PROMPT.GENERATE_TEST_CLICK_ELEMENT,
            UUV_PROMPT.GENERATE_TEST_WITHIN_ELEMENT,
            UUV_PROMPT.GENERATE_TEST_TYPE_ELEMENT
        ]),
        baseUrl: z.string().describe("The base URL of the page where the element is located."),
        accessibleName: z.string().optional().describe("Accessible name of the element"),
        accessibleRole: z.string().optional().describe("Accessible role of the element"),
        domSelector: z.string().optional().describe("Dom selector of the element"),
    }),
]).superRefine((data, ctx) => {
    if (
        data.promptName === UUV_PROMPT.GENERATE_TEST_EXPECT_ELEMENT ||
        data.promptName === UUV_PROMPT.GENERATE_TEST_CLICK_ELEMENT  ||
        data.promptName === UUV_PROMPT.GENERATE_TEST_WITHIN_ELEMENT ||
        data.promptName === UUV_PROMPT.GENERATE_TEST_TYPE_ELEMENT
    ) {
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
                promptName: z.enum([
                    UUV_PROMPT.GENERATE_TEST_EXPECT_ELEMENT,
                    UUV_PROMPT.GENERATE_TEST_CLICK_ELEMENT,
                    UUV_PROMPT.GENERATE_TEST_WITHIN_ELEMENT
                ]),
                baseUrl: z.string().describe("The base URL of the page where the element is located."),
                accessibleName: z.string().optional().describe("Accessible name of the element"),
                accessibleRole: z.string().optional().describe("Accessible role of the element"),
                domSelector: z.string().optional().describe("Dom selector of the element"),
            }),
            z.object({
                promptName: z.enum([
                    UUV_PROMPT.GENERATE_TEST_TYPE_ELEMENT
                ]),
                baseUrl: z.string().describe("The base URL of the page where the element is located."),
                valueToType: z.string().describe("Value to type"),
                accessibleName: z.string().optional().describe("Accessible name of the element"),
                accessibleRole: z.string().optional().describe("Accessible role of the element"),
                domSelector: z.string().optional().describe("Dom selector of the element"),
            })
        ]).superRefine((data, ctx) => {
            if (
                data.promptName === UUV_PROMPT.GENERATE_TEST_EXPECT_ELEMENT ||
                data.promptName === UUV_PROMPT.GENERATE_TEST_CLICK_ELEMENT  ||
                data.promptName === UUV_PROMPT.GENERATE_TEST_WITHIN_ELEMENT ||
                data.promptName === UUV_PROMPT.GENERATE_TEST_TYPE_ELEMENT
            ) {
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
            case UUV_PROMPT.GENERATE_TEST_EXPECT_ELEMENT:
            case UUV_PROMPT.GENERATE_TEST_CLICK_ELEMENT:
            case UUV_PROMPT.GENERATE_TEST_TYPE_ELEMENT:
            case UUV_PROMPT.GENERATE_TEST_WITHIN_ELEMENT:
                prompt = PromptRetrieverService.generatePrompt(args);
                break;

            default:
                throw new Error(`Bad parameters for request ${args}`);
        }
        return prompt;
    }
}
