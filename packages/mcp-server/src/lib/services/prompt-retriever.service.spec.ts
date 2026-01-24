import { PromptRetrieverService, UUV_PROMPT } from "./prompt-retriever.service";
import * as path from "node:path";
import fs from "node:fs";

// Mock the imported modules
jest.mock("node:path");
jest.mock("node:fs");

describe("PromptRetrieverService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("retrievePrompt", () => {
        it("should generate table prompt correctly", () => {
            const mockArgs = {
                promptName: UUV_PROMPT.GENERATE_TEST_EXPECT_TABLE,
                baseUrl: "http://example.com"
            };

            // Mock the file reading
            (fs.readFileSync as jest.Mock).mockReturnValue("Template for {{{baseUrl}}}");

            const result = PromptRetrieverService.retrievePrompt(mockArgs);

            expect(fs.readFileSync).toHaveBeenCalledWith(path.join(__dirname, "prompts", `${UUV_PROMPT.GENERATE_TEST_EXPECT_TABLE}.mustache`), "utf8");
            expect(result).toBe("Template for http://example.com");
        });

        it("should generate role and name prompt correctly", () => {
            const mockArgs = {
                promptName: UUV_PROMPT.GENERATE_TEST_EXPECT_ROLE_AND_NAME,
                accessibleName: "Hello world",
                accessibleRole: "button",
            };

            // Mock the file reading
            (fs.readFileSync as jest.Mock).mockReturnValue("Template with {{accessibleRole}} and '{{accessibleName}}'");

            const result = PromptRetrieverService.retrievePrompt(mockArgs);

            expect(fs.readFileSync).toHaveBeenCalledWith(path.join(__dirname, "prompts", `${UUV_PROMPT.GENERATE_TEST_EXPECT_ROLE_AND_NAME}.mustache`), "utf8");
            expect(result).toBe(`Template with ${mockArgs.accessibleRole} and '${mockArgs.accessibleName}'`);
        });

        it(`should throw error for invalid argument for ${UUV_PROMPT.GENERATE_TEST_EXPECT_ROLE_AND_NAME}`, () => {
            const mockArgs = {
                promptName: UUV_PROMPT.GENERATE_TEST_EXPECT_ROLE_AND_NAME,
                accessibleName: "Hello world",
            };

            expect(() => {
                PromptRetrieverService.retrievePrompt(mockArgs);
            }).toThrow(JSON.stringify([{
                expected: "string",
                code: "invalid_type",
                path: [
                    "accessibleRole"
                ],
                message: "Invalid input: expected string, received undefined"
            }], null, 2));
        });

        it("should throw error for invalid prompt name", () => {
            const mockArgs = {
                promptName: "invalid_prompt",
            };

            expect(() => {
                PromptRetrieverService.retrievePrompt(mockArgs);
            }).toThrow(
                JSON.stringify(
                    [
                        {
                            code: "invalid_union",
                            errors: [],
                            note: "No matching discriminator",
                            discriminator: "promptName",
                            path: ["promptName"],
                            message: "Invalid input",
                        },
                    ],
                    null,
                    2
                )
            );
        });

        it("should validate prompt generation requests correctly", () => {
            (fs.readFileSync as jest.Mock).mockReturnValue("Template with {{accessibleName}} and {{accessibleRole}}");

            // Valid table prompt
            const validTableArgs = {
                promptName: UUV_PROMPT.GENERATE_TEST_EXPECT_TABLE,
                baseUrl: "http://example.com"
            };

            expect(() => PromptRetrieverService.retrievePrompt(validTableArgs)).not.toThrow();

            // Valid role and name prompt
            const validRoleArgs = {
                promptName: UUV_PROMPT.GENERATE_TEST_EXPECT_ROLE_AND_NAME,
                accessibleName: "button",
                accessibleRole: "toto",
            };

            expect(() => PromptRetrieverService.retrievePrompt(validRoleArgs)).not.toThrow();
        });
    });
});
