import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { SentenceService } from "./services/sentence.service";
import { PromptRetrieverService, UUV_PROMPT } from "./services/prompt-retriever.service";
import { ExpectService } from "./services/expect.service";
import { getDefinedDictionary } from "@uuv/dictionary";

export function createUUVServer() {
    const server = new McpServer({
        name: "uuv-mcp-server",
        version: "0.0.1-beta",
    });

    server.registerTool(
        "retrieve_prompt",
        {
            title: "Retrieve uuv prompt",
            description: "Retrieve a uuv prompt template for a coding agent based on a prompt name and arguments.",
            inputSchema: {
                promptName: z.enum([
                    UUV_PROMPT.GENERATE_TEST_EXPECT_TABLE,
                    UUV_PROMPT.GENERATE_TEST_EXPECT_ELEMENT
                ]),
                baseUrl: z.string().describe("The base URL of the page"),
                // generate_test_expect_element Fields
                accessibleName: z.string().optional().describe("Accessible name (required for generate_role_and_name)"),
                accessibleRole: z.string().optional().describe("Accessible role (required for generate_role_and_name)"),
                domSelector: z.string().optional().describe("Dom selector of the element"),
            },
        },
        async ({ ...args }) => {
            return {
                content: [
                    {
                        type: "text",
                        text: PromptRetrieverService.retrievePrompt(args),
                    },
                ],
            };
        }
    );

    server.registerTool(
        "available_sentences",
        {
            title: "List Available UUV Sentences",
            description:
                // eslint-disable-next-line max-len
                "List all available UUV test sentences/phrases in Gherkin format. Use this when the user asks about UUV syntax, available commands, what sentences/phrases are available for testing, or needs help with UUV sentence structure. Can be filtered by category (given/when/then) or ARIA role (button, textbox, etc.) to show specific test actions.",
            inputSchema: {
                category: z
                    .enum(["general", "keyboard", "click", "contains", "type", "checkable"])
                    .optional()
                    .describe("Filters sentences based on the action type"),
                role: z.string().optional().describe("Filters sentences related to an accessible role"),
            },
        },
        async ({ category, role }) => {
            const sentenceService = new SentenceService(getDefinedDictionary("en"));
            const allSentences = sentenceService.searchSentences({ category, role });

            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(allSentences, null, 2),
                    },
                ],
            };
        }
    );

    server.registerTool(
        "generate_test_expect_element",
        {
            title: "Generate expect of html element with role and name",
            description:
                // eslint-disable-next-line max-len
                "Generate a complete UUV test scenario (Gherkin format) to verify the presence of an element with specified accessible name and role or domSelector. Use this when the user asks to create/write/generate a UUV scenario or test for checking element visibility. DON'T USE IF ACCESSIBLE ROLE IS grid, treegrid, table, or form",
            inputSchema: {
                baseUrl: z.string().describe("The base URL of the page where the element is located."),
                accessibleName: z.string().optional().describe("Accessible name of the element"),
                accessibleRole: z.string().optional().describe("Accessible role of the element"),
                domSelector: z.string().optional().describe("Dom selector of the element"),
            },
        },
        async ({ baseUrl, accessibleName, accessibleRole, domSelector }) => {
            if (accessibleRole === "table" || accessibleRole === "grid" || accessibleRole === "treegrid") {
                throw new Error("For role 'table/grid/treegrid', you must use generate_test_expect_table tool.");
            } else if (accessibleName && accessibleRole) {
                return {
                    content: [
                        {
                            type: "text",
                            text: ExpectService.generateExpectForAccessibleNameAndRole(baseUrl, accessibleName, accessibleRole),
                        },
                    ],
                };
            } else if (domSelector) {
                return {
                    content: [
                        {
                            type: "text",
                            text: ExpectService.generateExpectForDomSelector(baseUrl, domSelector),
                        },
                    ],
                };
            }
            throw new Error("You must provide either (accessibleRole AND accessibleName) or domSelector");
        }
    );

    server.registerTool(
        "generate_test_expect_table",
        {
            title: "Generate test for html table or grid or treeGrid",
            description:
                // eslint-disable-next-line max-len
                "Generate a complete UUV test scenario (Gherkin format) to verify the presence and the content of html table, grid or treegrid given innerHtml. ONLY USE IF ACCESSIBLE ROLE IS grid, treegrid, table, or form",
            inputSchema: {
                baseUrl: z.string().describe("The base URL of the page where the table/grid/treegrid is located."),
                innerHtmlFilePath: z.string().describe("File path containing the raw innerHTML content of the table, grid, or treegrid element"),
            },
        },
        async ({ baseUrl, innerHtmlFilePath }) => {
            return {
                content: [
                    {
                        type: "text",
                        text: await ExpectService.generateExpectForTable(baseUrl, innerHtmlFilePath),
                    },
                ],
            };
        }
    );

    return server;
}
