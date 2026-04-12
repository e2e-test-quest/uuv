import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { SentenceService } from "./services/sentence.service";
import {
    ElementByDomSelectorInputSchema,
    ElementByRoleAndNameInputSchema,
    InstallDependenciesInputSchema,
    CheckDependenciesInputSchema,
    GetUuvVersionInputSchema,
    PromptRetrieverService,
    UUV_MCP_SERVER_ITEM,
    uuvPrompts,
} from "./services/prompt-retriever.service";
import { installUuvDependency, checkUuvDependency, getVersion } from "./services/dependencies.service";
import { getDefinedDictionary } from "@uuv/dictionary";
import {
    ElementServiceType,
    ExpectTableService,
    FindElement,
    FindElementByDomSelector,
    FindElementByRoleAndName,
    getElementService,
} from "./services/expect.service";
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { getBaseUrl } from "./services/general.service";
import { generateScenario } from "./services/architect/architect.service";

function handleElementTestGeneration(input: Partial<FindElement> & { serviceType: ElementServiceType }): CallToolResult {
    let result: string;
    const service = getElementService(input.serviceType);

    if (input.accessibleName && input.accessibleRole) {
        result = service.generateTestForElement(input as FindElementByRoleAndName);
    } else if (input.domSelector) {
        result = service.generateTestForElement(input as FindElementByDomSelector);
    } else {
        throw new Error("You must provide either (accessibleRole AND accessibleName) or domSelector");
    }

    return {
        content: [
            {
                type: "text",
                text: result,
            },
        ],
    };
}

export function createUUVServer() {
    const server = new McpServer({
        name: "uuv-mcp-server",
        version: "0.0.1-beta",
    });

    server.registerPrompt(
        UUV_MCP_SERVER_ITEM.GENERATE_TEST_EXPECT_TABLE,
        {
            title: uuvPrompts[UUV_MCP_SERVER_ITEM.GENERATE_TEST_EXPECT_TABLE].title,
            description: uuvPrompts[UUV_MCP_SERVER_ITEM.GENERATE_TEST_EXPECT_TABLE].description,
            argsSchema: {
                baseUrl: z.string().describe("The base URL of the page where the table/grid/treegrid is located."),
            },
        },
        ({ ...args }) => ({
            messages: [
                {
                    role: "assistant",
                    content: {
                        type: "text",
                        text: PromptRetrieverService.retrievePrompt({
                            promptName: UUV_MCP_SERVER_ITEM.GENERATE_TEST_EXPECT_TABLE,
                            ...args,
                        }),
                    },
                },
            ],
        })
    );

    [
        UUV_MCP_SERVER_ITEM.GENERATE_TEST_EXPECT_ROLE_AND_NAME,
        UUV_MCP_SERVER_ITEM.GENERATE_TEST_CLICK_ROLE_AND_NAME,
        UUV_MCP_SERVER_ITEM.GENERATE_TEST_WITHIN_ROLE_AND_NAME,
    ].forEach((promptName: UUV_MCP_SERVER_ITEM) => {
        server.registerPrompt(
            promptName,
            {
                title: uuvPrompts[promptName].title,
                description: uuvPrompts[promptName].description,
                argsSchema: {
                    accessibleRole: z.string().optional().describe("Accessible role of the element"),
                    accessibleName: z.string().optional().describe("Accessible name of the element"),
                },
            },
            ({ ...args }) => ({
                messages: [
                    {
                        role: "assistant",
                        content: {
                            type: "text",
                            text: PromptRetrieverService.retrievePrompt({
                                promptName,
                                ...args,
                            }),
                        },
                    },
                ],
            })
        );
    });

    [
        UUV_MCP_SERVER_ITEM.GENERATE_TEST_EXPECT_DOM_SELECTOR,
        UUV_MCP_SERVER_ITEM.GENERATE_TEST_CLICK_DOM_SELECTOR,
        UUV_MCP_SERVER_ITEM.GENERATE_TEST_WITHIN_DOM_SELECTOR,
    ].forEach((promptName: UUV_MCP_SERVER_ITEM) => {
        server.registerPrompt(
            promptName,
            {
                title: uuvPrompts[promptName].title,
                description: uuvPrompts[promptName].description,
                argsSchema: {
                    domSelector: z.string().optional().describe("Dom selector of the element"),
                },
            },
            ({ ...args }) => ({
                messages: [
                    {
                        role: "assistant",
                        content: {
                            type: "text",
                            text: PromptRetrieverService.retrievePrompt({
                                promptName,
                                ...args,
                            }),
                        },
                    },
                ],
            })
        );
    });

    server.registerPrompt(
        UUV_MCP_SERVER_ITEM.GENERATE_TEST_TYPE_ROLE_AND_NAME,
        {
            title: uuvPrompts[UUV_MCP_SERVER_ITEM.GENERATE_TEST_TYPE_ROLE_AND_NAME].title,
            description: uuvPrompts[UUV_MCP_SERVER_ITEM.GENERATE_TEST_TYPE_ROLE_AND_NAME].description,
            argsSchema: {
                accessibleRole: z.string().optional().describe("Accessible role of the element"),
                accessibleName: z.string().optional().describe("Accessible name of the element"),
            },
        },
        ({ ...args }) => ({
            messages: [
                {
                    role: "assistant",
                    content: {
                        type: "text",
                        text: PromptRetrieverService.retrievePrompt({
                            promptName: UUV_MCP_SERVER_ITEM.GENERATE_TEST_TYPE_ROLE_AND_NAME,
                            ...args,
                        }),
                    },
                },
            ],
        })
    );

    server.registerPrompt(
        UUV_MCP_SERVER_ITEM.GENERATE_NOMINAL_TEST_CASE,
        {
            title: uuvPrompts[UUV_MCP_SERVER_ITEM.GENERATE_NOMINAL_TEST_CASE].title,
            description: uuvPrompts[UUV_MCP_SERVER_ITEM.GENERATE_NOMINAL_TEST_CASE].description,
            argsSchema: {
                testCase: z.string().describe("Brief description of the test scenario to be generated"),
            },
        },
        ({ ...args }) => ({
            messages: [
                {
                    role: "assistant",
                    content: {
                        type: "text",
                        text: PromptRetrieverService.retrievePrompt({
                            promptName: UUV_MCP_SERVER_ITEM.GENERATE_NOMINAL_TEST_CASE,
                            ...args,
                        }),
                    },
                },
            ],
        })
    );

    [
        UUV_MCP_SERVER_ITEM.INSTALL_UUV_DEPENDENCY,
        UUV_MCP_SERVER_ITEM.CHECK_UUV_DEPENDENCY,
        UUV_MCP_SERVER_ITEM.GET_UUV_VERSION,
    ].forEach((promptName: UUV_MCP_SERVER_ITEM) => {
        server.registerPrompt(
            promptName,
            {
                title: uuvPrompts[promptName].title,
                description: uuvPrompts[promptName].description,
                argsSchema: {},
            },
            ({ ...args }) => ({
                messages: [
                    {
                        role: "assistant",
                        content: {
                            type: "text",
                            text: PromptRetrieverService.retrievePrompt({
                                promptName,
                                ...args,
                            }),
                        },
                    },
                ],
            })
        );
    });

    server.registerTool(
        UUV_MCP_SERVER_ITEM.GET_BASE_URL,
        {
            title: uuvPrompts[UUV_MCP_SERVER_ITEM.GET_BASE_URL].title,
            description: uuvPrompts[UUV_MCP_SERVER_ITEM.GET_BASE_URL].description,
            inputSchema: {
                projectPath: z.string().describe("Project absolute path"),
            },
        },
        async ({ projectPath }) => {
            return {
                content: [
                    {
                        type: "text",
                        text: getBaseUrl(projectPath),
                    },
                ],
            };
        }
    );

    server.registerTool(
        UUV_MCP_SERVER_ITEM.AVAILABLE_SENTENCES,
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
        UUV_MCP_SERVER_ITEM.GENERATE_TEST_EXPECT_ROLE_AND_NAME,
        {
            title: uuvPrompts[UUV_MCP_SERVER_ITEM.GENERATE_TEST_EXPECT_ROLE_AND_NAME].title,
            description:
                // eslint-disable-next-line max-len
                "Generate a complete UUV test scenario (Gherkin format) to verify the presence of an element with specified accessible name and role. Use this when the user asks to create/write/generate a UUV scenario or test for checking element visibility. DON'T USE IF ACCESSIBLE ROLE IS grid, treegrid, table, or form",
            inputSchema: ElementByRoleAndNameInputSchema,
        },
        ({ baseUrl, accessibleName, accessibleRole }) => {
            if (accessibleRole === "table" || accessibleRole === "grid" || accessibleRole === "treegrid") {
                throw new Error("For role 'table/grid/treegrid', you must use generate_test_expect_table tool.");
            }
            return handleElementTestGeneration({ serviceType: ElementServiceType.EXPECT, baseUrl, accessibleName, accessibleRole });
        }
    );

    server.registerTool(
        UUV_MCP_SERVER_ITEM.GENERATE_TEST_EXPECT_DOM_SELECTOR,
        {
            title: uuvPrompts[UUV_MCP_SERVER_ITEM.GENERATE_TEST_EXPECT_DOM_SELECTOR].title,
            description:
                // eslint-disable-next-line max-len
                "Generate a complete UUV test scenario (Gherkin format) to verify the presence of an element with specified domSelector. Use this when the user asks to create/write/generate a UUV scenario or test for checking element visibility. DON'T USE IF ACCESSIBLE ROLE IS grid, treegrid, table, or form",
            inputSchema: ElementByDomSelectorInputSchema,
        },
        ({ baseUrl, domSelector }) => {
            return handleElementTestGeneration({ serviceType: ElementServiceType.EXPECT, baseUrl, domSelector });
        }
    );

    server.registerTool(
        UUV_MCP_SERVER_ITEM.GENERATE_TEST_CLICK_ROLE_AND_NAME,
        {
            title: uuvPrompts[UUV_MCP_SERVER_ITEM.GENERATE_TEST_CLICK_ROLE_AND_NAME].title,
            description:
                // eslint-disable-next-line max-len
                "Generate a complete UUV test scenario (Gherkin format) to click on an element with specified accessible name and role. Use this when the user asks to create/write/generate a UUV scenario or test for checking element visibility. DON'T USE IF ACCESSIBLE ROLE IS grid, treegrid, table, or form",
            inputSchema: ElementByRoleAndNameInputSchema,
        },
        async ({ baseUrl, accessibleName, accessibleRole }) => {
            return handleElementTestGeneration({ serviceType: ElementServiceType.CLICK, baseUrl, accessibleName, accessibleRole });
        }
    );

    server.registerTool(
        UUV_MCP_SERVER_ITEM.GENERATE_TEST_CLICK_DOM_SELECTOR,
        {
            title: uuvPrompts[UUV_MCP_SERVER_ITEM.GENERATE_TEST_CLICK_DOM_SELECTOR].title,
            description:
                // eslint-disable-next-line max-len
                "Generate a complete UUV test scenario (Gherkin format) to click on an element with specified domSelector. Use this when the user asks to create/write/generate a UUV scenario or test for checking element visibility. DON'T USE IF ACCESSIBLE ROLE IS grid, treegrid, table, or form",
            inputSchema: ElementByDomSelectorInputSchema,
        },
        async ({ baseUrl, domSelector }) => {
            return handleElementTestGeneration({ serviceType: ElementServiceType.CLICK, baseUrl, domSelector });
        }
    );

    server.registerTool(
        UUV_MCP_SERVER_ITEM.GENERATE_TEST_WITHIN_ROLE_AND_NAME,
        {
            title: "Generate test that focus within an html element with (role and name) or domSelector",
            description:
                // eslint-disable-next-line max-len
                "Generate a complete UUV test scenario (Gherkin format) that focus within an html element with specified accessible name. Use this when the user asks to create/write/generate a UUV scenario or test for checking element visibility. DON'T USE IF ACCESSIBLE ROLE IS grid, treegrid, table, or form",
            inputSchema: ElementByRoleAndNameInputSchema,
        },
        async ({ baseUrl, accessibleName, accessibleRole }) => {
            return handleElementTestGeneration({ serviceType: ElementServiceType.WITHIN, baseUrl, accessibleName, accessibleRole });
        }
    );

    server.registerTool(
        UUV_MCP_SERVER_ITEM.GENERATE_TEST_WITHIN_DOM_SELECTOR,
        {
            title: "Generate test that focus within an html element with (role and name) or domSelector",
            description:
                // eslint-disable-next-line max-len
                "Generate a complete UUV test scenario (Gherkin format) that focus within an html element with specified domSelector. Use this when the user asks to create/write/generate a UUV scenario or test for checking element visibility. DON'T USE IF ACCESSIBLE ROLE IS grid, treegrid, table, or form",
            inputSchema: ElementByDomSelectorInputSchema,
        },
        async ({ baseUrl, domSelector }) => {
            return handleElementTestGeneration({ serviceType: ElementServiceType.WITHIN, baseUrl, domSelector });
        }
    );

    server.registerTool(
        UUV_MCP_SERVER_ITEM.GENERATE_TEST_TYPE_ROLE_AND_NAME,
        {
            title: uuvPrompts[UUV_MCP_SERVER_ITEM.GENERATE_TEST_TYPE_ROLE_AND_NAME].title,
            description:
                // eslint-disable-next-line max-len
                "Generate a complete UUV test scenario (Gherkin format) that types a value into an html element with specified accessible name and role. Use this when the user asks to create/write/generate a UUV scenario or test for checking element visibility. DON'T USE IF ACCESSIBLE ROLE IS grid, treegrid, table, or form",
            inputSchema: ElementByRoleAndNameInputSchema,
        },
        async ({ baseUrl, accessibleName, accessibleRole }) => {
            return handleElementTestGeneration({ serviceType: ElementServiceType.TYPE, baseUrl, accessibleName, accessibleRole });
        }
    );

    server.registerTool(
        UUV_MCP_SERVER_ITEM.GENERATE_TEST_EXPECT_TABLE,
        {
            title: uuvPrompts[UUV_MCP_SERVER_ITEM.GENERATE_TEST_EXPECT_TABLE].title,
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
                        text: await ExpectTableService.generateExpectForTable(baseUrl, innerHtmlFilePath),
                    },
                ],
            };
        }
    );

    server.registerTool(
        UUV_MCP_SERVER_ITEM.GENERATE_NOMINAL_TEST_CASE,
        {
            title: uuvPrompts[UUV_MCP_SERVER_ITEM.GENERATE_NOMINAL_TEST_CASE].title,
            description: uuvPrompts[UUV_MCP_SERVER_ITEM.GENERATE_NOMINAL_TEST_CASE].title, //TODO: improve
            inputSchema: {
                baseUrl: z.string().describe("The base URL of the page where the element is located."),
                testCase: z.string().describe("Brief description of the test scenario to be generated"),
            },
        },
        async ({ baseUrl, testCase }) => {
            // eslint-disable-next-line dot-notation
            const llmModel = process.env["UUV_LLM_MODEL"] ?? "anthropic/claude-sonnet-4.6";
            // eslint-disable-next-line dot-notation
            const llmApi = process.env["UUV_LLM_API"];
            return {
                content: [
                    {
                        type: "text",
                        text: (await generateScenario(baseUrl, testCase, llmModel, llmApi)) ?? "",
                    },
                ],
            };
        }
    );

    server.registerTool(
        UUV_MCP_SERVER_ITEM.INSTALL_UUV_DEPENDENCY,
        {
            title: uuvPrompts[UUV_MCP_SERVER_ITEM.INSTALL_UUV_DEPENDENCY].title,
            description: uuvPrompts[UUV_MCP_SERVER_ITEM.INSTALL_UUV_DEPENDENCY].description,
            inputSchema: InstallDependenciesInputSchema,
        },
        async ({ projectPath, packageName }) => {
            installUuvDependency(projectPath, packageName);
            return {
                content: [
                    {
                        type: "text",
                        text: `Successfully installed ${packageName || "@uuv/playwright"} in ${projectPath}`,
                    },
                ],
            };
        }
    );

    server.registerTool(
        UUV_MCP_SERVER_ITEM.CHECK_UUV_DEPENDENCY,
        {
            title: uuvPrompts[UUV_MCP_SERVER_ITEM.CHECK_UUV_DEPENDENCY].title,
            description: uuvPrompts[UUV_MCP_SERVER_ITEM.CHECK_UUV_DEPENDENCY].description,
            inputSchema: CheckDependenciesInputSchema,
        },
        async ({ projectPath }) => {
            const isInstalled = checkUuvDependency(projectPath);
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(isInstalled),
                    },
                ],
            };
        }
    );

    server.registerTool(
        UUV_MCP_SERVER_ITEM.GET_UUV_VERSION,
        {
            title: uuvPrompts[UUV_MCP_SERVER_ITEM.GET_UUV_VERSION].title,
            description: uuvPrompts[UUV_MCP_SERVER_ITEM.GET_UUV_VERSION].description,
            inputSchema: GetUuvVersionInputSchema,
        },
        async ({ projectPath }) => {
            const version = getVersion(projectPath);
            return {
                content: [
                    {
                        type: "text",
                        text: version ?? "null",
                    },
                ],
            };
        }
    );

    return server;
}
