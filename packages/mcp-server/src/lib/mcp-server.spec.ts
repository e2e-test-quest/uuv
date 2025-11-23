import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory";
import { createUUVServer } from "./mcp-server-factory";
import { UUV_PROMPT } from "./services/prompt-retriever.service";
import { BaseSentence } from "@uuv/dictionary";
import path from "path";

describe("UUV MCP Server", () => {
    let client: Client;
    let server: McpServer;

    beforeEach(async () => {
        const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();

        server = createUUVServer();

        client = new Client(
            { name: "test-client", version: "1.0.0" },
            { capabilities: {} }
        );

        await Promise.all([
            server.connect(serverTransport),
            client.connect(clientTransport)
        ]);
    });

    afterEach(async () => {
        await client.close();
        await server.close();
    });

    it("should exposes existing tools", async () => {
        const tools = await client.listTools();

        expect(tools.tools.map(tool => tool.name)).toEqual([
            "retrieve_prompt",
            "available_sentences",
            "generate_test_expect_element",
            "generate_test_expect_table"
        ]);
    });

    it("should throws error when retrieve prompt parameters are invalid", async () => {
        const result = await client.callTool({
            name: "retrieve_prompt",
            arguments: {
                promptName: UUV_PROMPT.GENERATE_TEST_EXPECT_ELEMENT,
                baseUrl: "https://example.com"
            }
        });

        expect(JSON.parse(result.content[0].text)).toEqual([{
            code: "custom",
            path: [],
            message: "You must provide either (accessibleRole AND accessibleName) or domSelector"
        }]);
    });

    it(`should retrieve prompt ${UUV_PROMPT.GENERATE_TEST_EXPECT_ELEMENT} with accessible name and accessible role`, async () => {
        const result = await client.callTool({
            name: "retrieve_prompt",
            arguments: {
                promptName: UUV_PROMPT.GENERATE_TEST_EXPECT_ELEMENT,
                baseUrl: "https://example.com",
                accessibleName: "Get started",
                accessibleRole: "Button"
            }
        });

        expect(result.content[0]).toEqual({
            type: "text",
            text: "Use UUV and Filesystem MCP tools:\n" +
                "    1. With uuv_generate_role_and_name, Generate UUV tests into ./uuv/e2e to verify that an element with accessibleName \"Get started\" and accessibleRole \"Button\" exist on the webpage https://example.com\n" +
                "    2. Write generated uuv test case into a .feature file in local folder ./uuv/e2e (must use actual line breaks, not literal \"\\n\" characters)"
        });
    });

    it(`should retrieve prompt ${UUV_PROMPT.GENERATE_TEST_EXPECT_ELEMENT} with domSelector`, async () => {
        const result = await client.callTool({
            name: "retrieve_prompt",
            arguments: {
                promptName: UUV_PROMPT.GENERATE_TEST_EXPECT_ELEMENT,
                baseUrl: "https://example.com",
                domSelector: "#fakeItem > #fakeContainer"
            }
        });

        expect(result.content[0]).toEqual({
            type: "text",
            text: "Use UUV and Filesystem MCP tools:\n" +
                "    1. With uuv_generate_role_and_name, Generate UUV tests into ./uuv/e2e to verify that an element with domSelector \"#fakeItem > #fakeContainer\" exist on the webpage https://example.com\n" +
                "    2. Write generated uuv test case into a .feature file in local folder ./uuv/e2e (must use actual line breaks, not literal \"\\n\" characters)"
        });
    });

    it(`should retrieve prompt ${UUV_PROMPT.GENERATE_TEST_EXPECT_TABLE}`, async () => {
        const result = await client.callTool({
            name: "retrieve_prompt",
            arguments: {
                promptName: UUV_PROMPT.GENERATE_TEST_EXPECT_TABLE,
                baseUrl: "https://example.com",
            }
        });

        expect(result.content[0]).toEqual({
            type: "text",
            text: "Use the Playwright and UUV MCP tools:\n" +
                "    1. Open a browser, then navigate to https://example.com\n" +
                "    2. Evaluate exactly, ensuring that the extracted HTML is not truncated: document.querySelector('table').outerHTML\n" +
                "    3. Write resulting HTML of the previous step into a file named extraction.html in the current project directory\n" +
                "    4. With uuv_generate_Table, Generate UUV tests into ./uuv/e2e to verify the html table with absolute path /workspaces/opensource/weather-app/extraction.html\n" +
                "    5. Write generated uuv test into a .feature file in local folder ./uuv/e2e (must use actual line breaks, not literal \"\\n\" characters)\n" +
                "\n" +
                "IMPORTANT:\n" +
                "    - When Playwright returns the result, ignore any console logs or debug lines."
        });
    });

    it("should list available sentences", async () => {
        const result = await client.callTool({
            name: "available_sentences",
            arguments: {}
        });
        const sentences = JSON.parse(result.content[0].text);
        expect(sentences.length).toBeGreaterThan(0);
    });

    it("should list available sentences filtered by role", async () => {
        const result = await client.callTool({
            name: "available_sentences",
            arguments: {
                role: "button"
            }
        });
        const sentences = JSON.parse(result.content[0].text);
        expect(sentences.length).toBeGreaterThan(0);
        expect(sentences).toEqual(
            expect.arrayOf(
                expect.objectContaining({
                    role: "button",
                }),
            )
        );
    });

    it("should list available sentences filtered by section", async () => {
        const result = await client.callTool({
            name: "available_sentences",
            arguments: {
                category: "click"
            }
        });
        const sentences = JSON.parse(result.content[0].text);
        expect(sentences.length).toBeGreaterThan(0);
        expect(sentences).toEqual(
            expect.arrayOf(
                expect.objectContaining({
                    section: "click",
                }),
            )
        );
    });

    it("should list available sentences filtered by role section", async () => {
        const result = await client.callTool({
            name: "available_sentences",
            arguments: {
                category: "click",
                role: "button"
            }
        });
        const sentences = JSON.parse(result.content[0].text);
        expect(sentences.length).toBeGreaterThan(0);
        expect(sentences).toEqual(
            expect.arrayOf(
                expect.objectContaining({
                    section: "click",
                    role: "button"
                }),
            )
        );
    });

    it("should throws error when generate_test_expect_element parameters are invalid", async () => {
        const result = await client.callTool({
            name: UUV_PROMPT.GENERATE_TEST_EXPECT_ELEMENT,
            arguments: {
                promptName: UUV_PROMPT.GENERATE_TEST_EXPECT_ELEMENT,
                baseUrl: "https://example.com"
            }
        });

        expect(result.content[0]).toEqual({
            text: "You must provide either (accessibleRole AND accessibleName) or domSelector",
            type: "text"
        });
    });

    it("should throws error when generate_test_expect_element is call for accessibleRole table", async () => {
        const result = await client.callTool({
            name: UUV_PROMPT.GENERATE_TEST_EXPECT_ELEMENT,
            arguments: {
                baseUrl: "https://example.com",
                accessibleRole: "table",
                accessibleName: "temp"
            }
        });

        expect(result.content[0].text).toEqual("For role 'table/grid/treegrid', you must use generate_test_expect_table tool.");
    });

    it("should generate_test_expect_element with accessible name and accessible role", async () => {
        const result = await client.callTool({
            name: UUV_PROMPT.GENERATE_TEST_EXPECT_ELEMENT,
            arguments: {
                baseUrl: "https://example.com",
                accessibleName: "Get started",
                accessibleRole: "Button"
            }
        });

        expect(result.content[0]).toEqual({
            type: "text",
            text: "Feature: Your amazing feature name\n" +
                "  Scenario: Action - An action\n" +
                "    Given I visit path \"https://example.com\"\n" +
                "    Then I should see undefined Button named \"Get started\"\n"
        });
    });

    it("should generate_test_expect_element with domSelector", async () => {
        const result = await client.callTool({
            name: UUV_PROMPT.GENERATE_TEST_EXPECT_ELEMENT,
            arguments: {
                baseUrl: "https://example.com",
                domSelector: "#fakeItem > #fakeContainer"
            }
        });

        expect(result.content[0]).toEqual({
            type: "text",
            text: "Feature: Your amazing feature name\n" +
                "  Scenario: Action - An action\n" +
                "    Given I visit path \"https://example.com\"\n" +
                "    Then I should see an element with selector \"#fakeItem > #fakeContainer\"\n"
        });
    });

    it("should generate_test_expect_table", async () => {
        const result = await client.callTool({
            name: UUV_PROMPT.GENERATE_TEST_EXPECT_TABLE,
            arguments: {
                baseUrl: "https://example.com",
                innerHtmlFilePath: path.join(__dirname, "tests", "mock-table.html")
            }
        });

        expect(result.content[0]).toEqual({
            type: "text",
            text: "Feature: Your amazing feature name\n" +
                "  Scenario: Action - Expect Array\n" +
                "    Given I visit path \"https://example.com\"\n" +
                "    Then I should see a table named \"Mock table\" and containing \n" +
                "      | Company                      | Contact          | Country |\n" +
                "      | ---------------------------- | ---------------- | ------- |\n" +
                "      | Alfreds Futterkiste          | Maria Anders     | Germany |\n" +
                "      | Centro comercial Moctezuma   | Francisco Chang  | Mexico  |\n" +
                "      | Ernst Handel                 | Roland Mendel    | Austria |\n" +
                "      | Island Trading               | Helen Bennett    | UK      |\n" +
                "      | Laughing Bacchus Winecellars | Yoshi Tannamuri  | Canada  |\n" +
                "      | Magazzini Alimentari Riuniti | Giovanni Rovelli | Italy   |\n"
        });
    });

    it("should throw error for invalid tool call", async () => {
        await expect(client.callTool({ name: "non_existent_tool" })).rejects.toThrow();
    });
});
