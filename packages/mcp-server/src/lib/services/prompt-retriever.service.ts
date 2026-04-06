import * as path from "node:path";
import fs from "node:fs";
import { z } from "zod";
import { render } from "mustache";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PromptExtraArgs = Record<string, any>;

export type PromptArgs = {
    promptName: UUV_MCP_SERVER_ITEM;
} | PromptExtraArgs;

export enum UUV_MCP_SERVER_ITEM {
    AVAILABLE_SENTENCES = "availableSentences",
    GET_BASE_URL = "getBaseUrl",
    GENERATE_TEST_EXPECT_TABLE = "genTestExpectTable",
    GENERATE_TEST_EXPECT_ROLE_AND_NAME = "genTestExpectRoleAndName",
    GENERATE_TEST_EXPECT_DOM_SELECTOR = "genTestExpectDomSelector",
    GENERATE_TEST_CLICK_ROLE_AND_NAME = "genTestClickRoleAndName",
    GENERATE_TEST_CLICK_DOM_SELECTOR = "genTestClickDomSelector",
    GENERATE_TEST_WITHIN_ROLE_AND_NAME = "genTestWithinRoleAndName",
    GENERATE_TEST_WITHIN_DOM_SELECTOR = "genTestWithinDomSelector",
    GENERATE_TEST_TYPE_ROLE_AND_NAME = "genTestTypeRoleAndName",
    GENERATE_NOMINAL_TEST_CASE = "genNominalTestCase"
}

export const uuvPrompts = {
    [UUV_MCP_SERVER_ITEM.GET_BASE_URL]: {
        title: "getBaseUrl",
        description: "Retrieve project base url for generated UUV tests"
    },
    [UUV_MCP_SERVER_ITEM.GENERATE_TEST_EXPECT_TABLE]: {
        title: "GenerateTestExpectTable",
        description: "Generate test for html table or grid or treeGrid"
    },
    [UUV_MCP_SERVER_ITEM.GENERATE_TEST_EXPECT_ROLE_AND_NAME]: {
        title: "GenerateTestExpectElement",
        description: "Generate test that expects of html element with accessible role and accessible name"
    },
    [UUV_MCP_SERVER_ITEM.GENERATE_TEST_EXPECT_DOM_SELECTOR]: {
        title: "GenerateTestExpectElement",
        description: "Generate test that expects of html element with domSelector"
    },
    [UUV_MCP_SERVER_ITEM.GENERATE_TEST_CLICK_ROLE_AND_NAME]: {
        title: "GenerateTestClickElement",
        description: "Generate test that clicks on html element with accessible role and accessible name"
    },
    [UUV_MCP_SERVER_ITEM.GENERATE_TEST_CLICK_DOM_SELECTOR]: {
        title: "GenerateTestClickElement",
        description: "Generate test that clicks on html element with domSelector"
    },
    [UUV_MCP_SERVER_ITEM.GENERATE_TEST_WITHIN_ROLE_AND_NAME]: {
        title: "GenerateTestWithinElement",
        description: "Generate test that focus within an html element with accessible role and accessible name"
    },
    [UUV_MCP_SERVER_ITEM.GENERATE_TEST_WITHIN_DOM_SELECTOR]: {
        title: "GenerateTestWithinElement",
        description: "Generate test that focus within an html element with domSelector"
    },
    [UUV_MCP_SERVER_ITEM.GENERATE_TEST_TYPE_ROLE_AND_NAME]: {
        title: "GenerateTestTypeElement",
        description: "Generate test that types a value into html element with accessible role and accessible name"
    },
    [UUV_MCP_SERVER_ITEM.GENERATE_NOMINAL_TEST_CASE]: {
        title: "GenerateNominalTestCase",
        description: "Generates a UUV test scenario for the nominal case"
    }
};

export const ElementByRoleAndNameInputSchema = {
    baseUrl: z.string().describe("The base URL of the page where the element is located."),
    accessibleRole: z.string().describe("Accessible role of the element"),
    accessibleName: z.string().describe("Accessible name of the element"),
    // valueToType: z.string().describe("Value to type"), TODO: implement this arg for UUV_PROMPT.GENERATE_TEST_TYPE_ROLE_AND_NAME
};

export const ElementByDomSelectorInputSchema = {
    baseUrl: z.string().describe("The base URL of the page where the element is located."),
    domSelector: z.string().describe("Dom selector of the element"),
};

export const UUVPromptInputSchema = z.discriminatedUnion("promptName", [
    z.object({
        promptName: z.literal(UUV_MCP_SERVER_ITEM.GENERATE_TEST_EXPECT_TABLE),
        baseUrl: z.string().describe("The base URL of the page where the table/grid/treegrid is located."),
    }),
    z.object({
        promptName: z.literal(UUV_MCP_SERVER_ITEM.GENERATE_NOMINAL_TEST_CASE),
        testCase: z.string().describe("Brief description of the test scenario to be generated"),
    }),
    z.object({
        promptName: z.enum([
            UUV_MCP_SERVER_ITEM.GENERATE_TEST_EXPECT_ROLE_AND_NAME,
            UUV_MCP_SERVER_ITEM.GENERATE_TEST_CLICK_ROLE_AND_NAME,
            UUV_MCP_SERVER_ITEM.GENERATE_TEST_WITHIN_ROLE_AND_NAME,
            UUV_MCP_SERVER_ITEM.GENERATE_TEST_TYPE_ROLE_AND_NAME
        ]),
        accessibleRole: z.string().describe("Accessible role of the element"),
        accessibleName: z.string().describe("Accessible name of the element"),
    }),
    z.object({
        promptName: z.enum([
            UUV_MCP_SERVER_ITEM.GENERATE_TEST_EXPECT_DOM_SELECTOR,
            UUV_MCP_SERVER_ITEM.GENERATE_TEST_CLICK_DOM_SELECTOR,
            UUV_MCP_SERVER_ITEM.GENERATE_TEST_WITHIN_DOM_SELECTOR
        ]),
        domSelector: z.string().describe("Dom selector of the element"),
    }),
]);


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
        return UUVPromptInputSchema.parse(args);
    }

    public static retrievePrompt(args: PromptArgs) {
        const validatedPrompt = PromptRetrieverService.validatePromptGenerationRequest(args);
        let prompt: string;
        switch (validatedPrompt.promptName) {
            case UUV_MCP_SERVER_ITEM.GENERATE_TEST_EXPECT_TABLE:
            case UUV_MCP_SERVER_ITEM.GENERATE_TEST_EXPECT_ROLE_AND_NAME:
            case UUV_MCP_SERVER_ITEM.GENERATE_TEST_EXPECT_DOM_SELECTOR:
            case UUV_MCP_SERVER_ITEM.GENERATE_TEST_CLICK_ROLE_AND_NAME:
            case UUV_MCP_SERVER_ITEM.GENERATE_TEST_CLICK_DOM_SELECTOR:
            case UUV_MCP_SERVER_ITEM.GENERATE_TEST_TYPE_ROLE_AND_NAME:
            case UUV_MCP_SERVER_ITEM.GENERATE_TEST_WITHIN_ROLE_AND_NAME:
            case UUV_MCP_SERVER_ITEM.GENERATE_TEST_WITHIN_DOM_SELECTOR:
            case UUV_MCP_SERVER_ITEM.GENERATE_NOMINAL_TEST_CASE:
                prompt = PromptRetrieverService.generatePrompt(args);
                break;

            default:
                throw new Error(`Bad parameters for request ${args}`);
        }
        return prompt;
    }
}
