import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { buildResultingScript, ExpectTranslator, TableAndGridService } from "@uuv/assistant";
import { enSentences, enBasedRoleSentences, EN_ROLES } from "@uuv/runner-commons/wording/web/en";
import { JSDOM } from "jsdom";
import * as fs from "node:fs";

// Create an MCP server
const server = new McpServer({
    name: "demo-server",
    version: "1.0.0"
});

function generateExpectFromAccessibleNameAndRole(baseUrl: string, accessibleName: string, accessibleRole: string): string {
    const translator = new ExpectTranslator();
    const result = translator.getSentenceFromAccessibleRoleAndName(accessibleRole, accessibleName);
    return buildResultingScript("Your amazing feature name", "Action - An action", result.sentences, baseUrl);
}

function getAllAvailableSentences() {
    const sentences = enSentences;

    EN_ROLES.forEach(role => {
        enBasedRoleSentences.enriched
            .filter(sentence => sentence.section === "general" ||
                (sentence.section === "keyboard" && role.shouldGenerateKeyboardSentence) ||
                (sentence.section === "click" && role.shouldGenerateClickSentence) ||
                (sentence.section === "contains" && role.shouldGenerateContainsSentence) ||
                (sentence.section === "type" && role.shouldGenerateTypeSentence) ||
                (sentence.section === "checkable" && role.shouldGenerateCheckedSentence)
            )
            .map(sentence => {
                return {
                    ...sentence,
                    role: role.name,
                    key: `${sentence.key}.role.${role.name.toLowerCase()}`,
                    wording: sentence.wording.replaceAll("(n)", "")
                        .replaceAll("$roleName", role.name)
                        .replaceAll("$definiteArticle", role.getDefiniteArticle())
                        .replaceAll("$indefiniteArticle", role.getIndefiniteArticle())
                        .replaceAll("$namedAdjective", role.namedAdjective())
                        .replaceAll("$ofDefiniteArticle", role.getOfDefiniteArticle())
                };
            })
            .forEach(sentence => {
                sentences.push(sentence);
            });
    });

    return sentences;
}

server.registerTool("generateExpectFromAccessibleNameAndRole",
    {
        title: "generateExpectFromAccessibleNameAndRole",
        description: "Generate a complete UUV test scenario (Gherkin format) to verify the presence of an element with specified accessible name and role. Use this when the user asks to create/write/generate a UUV scenario or test for checking element visibility. DON'T USE IF ACCESSIBLE ROLE IS grid, treegrid, table, or form",
        inputSchema: {
            baseUrl: z.string().describe("The base URL of the page where the element is located."),
            accessibleName: z.string().describe("Accessible name of the element"),
            accessibleRole: z.string().describe("Accessible role of the element")
        }
    },
    async ({ baseUrl, accessibleName, accessibleRole }) => {
        if (accessibleRole === "table" || accessibleRole === "grid" || accessibleRole === "treegrid") {
            throw new Error("For role 'table/grid/treegrid', you must use generateExpectForTable.");
        }
        return {
            content: [{
                type: "text",
                text: generateExpectFromAccessibleNameAndRole(baseUrl, accessibleName, accessibleRole)
            }]
        };
    }
);

server.registerTool("listAvailableUUVSentences",
    {
        title: "List Available UUV Sentences",
        description: "List all available UUV test sentences/phrases in Gherkin format. Use this when the user asks about UUV syntax, available commands, what sentences/phrases are available for testing, or needs help with UUV sentence structure. Can be filtered by category (given/when/then) or ARIA role (button, textbox, etc.) to show specific test actions.",
        inputSchema: {
            category: z.string().optional(),
            role: z.string().optional()
        }
    },
    async ({ category, role }) => {

        const allSentences = getAllAvailableSentences();

        return {
            content: [{
                type: "text",
                text: JSON.stringify(allSentences, null, 2)
            }]
        };
    }
);

server.registerTool("generateExpectForTable",
    {
        title: "generateExpectForHtmlTableOrGridOrTreeGrid",
        description: "Generate a complete UUV test scenario (Gherkin format) to verify the presence and the content of html table, grid or treegrid given innerHtml. ONLY USE IF ACCESSIBLE ROLE IS grid, treegrid, table, or form",
        inputSchema: {
            baseUrl: z.string().describe("The base URL of the page where the table/grid/treegrid is located."),
            innerHtmlFilePath: z.string().describe("File path containing the raw innerHTML content of the table, grid, or treegrid element")
        }
    },
    async ({ baseUrl, innerHtmlFilePath }) => {
        const tableAndGridService = new TableAndGridService();
        const dom = new JSDOM(fs.readFileSync(innerHtmlFilePath, "utf8"));
        const element = dom.window.document.body.firstElementChild;
        const result = await tableAndGridService.buildResultSentence(element as HTMLElement);
        return {
            content: [{
                type: "text",
                text: buildResultingScript("Your amazing feature name", "Action - Expect Array", result, baseUrl)
            }]
        };
    }
);

// Start receiving messages on stdin and sending messages on stdout
// console.info("Starting UUV MCP server...");
const transport = new StdioServerTransport();
server.connect(transport);
