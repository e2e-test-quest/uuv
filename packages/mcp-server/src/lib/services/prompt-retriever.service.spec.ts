import { PromptRetrieverService } from "./prompt-retriever.service";
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
                promptName: "generate_test_expect_table",
                baseUrl: "http://example.com",
            };

            // Mock the file reading
            (fs.readFileSync as jest.Mock).mockReturnValue("Template for {{baseUrl}}");

            const result = PromptRetrieverService.retrievePrompt(mockArgs);

            expect(fs.readFileSync).toHaveBeenCalledWith(path.join(__dirname, "prompts", "generate_test_expect_table.mustache"), "utf8");
            expect(result).toBe("Template for http://example.com");
        });

        it("should generate role and name prompt correctly", () => {
            const mockArgs = {
                promptName: "generate_test_expect_element",
                baseUrl: "http://example.com",
                accessibleName: "Hello world",
                accessibleRole: "button",
            };

            // Mock the file reading
            (fs.readFileSync as jest.Mock).mockReturnValue("Template for {{baseUrl}} with {{accessibleRole}} and '{{accessibleName}}'");

            const result = PromptRetrieverService.retrievePrompt(mockArgs);

            expect(fs.readFileSync).toHaveBeenCalledWith(path.join(__dirname, "prompts", "generate_test_expect_element.mustache"), "utf8");
            expect(result).toBe(`Template for ${mockArgs.baseUrl} with ${mockArgs.accessibleRole} and '${mockArgs.accessibleName}'`);
        });

        it("should throw error for invalid argument for generate_test_expect_element", () => {
            const mockArgs = {
                promptName: "generate_test_expect_element",
                baseUrl: "http://example.com",
                accessibleName: "Hello world",
            };

            expect(() => {
                PromptRetrieverService.retrievePrompt(mockArgs);
            }).toThrow("You must provide either 'domSelector' or the pair 'accessibleName' and 'accessibleRole'.");
        });

        it("should throw error for invalid prompt name", () => {
            const mockArgs = {
                promptName: "invalid_prompt",
                baseUrl: "http://example.com",
            };

            expect(() => {
                PromptRetrieverService.retrievePrompt(mockArgs);
            }).toThrow(
                JSON.stringify(
                    [
                        {
                            code: "invalid_union_discriminator",
                            options: ["generate_test_expect_table", "generate_test_expect_element"],
                            path: ["promptName"],
                            message: "Invalid discriminator value. Expected 'generate_test_expect_table' | 'generate_test_expect_element'",
                        },
                    ],
                    null,
                    2
                )
            );
        });

        it("should validate prompt generation requests correctly", () => {
            (fs.readFileSync as jest.Mock).mockReturnValue("Template for {{baseUrl}} with {{accessibleName}} and {{accessibleRole}}");

            // Valid table prompt
            const validTableArgs = {
                promptName: "generate_test_expect_table",
                baseUrl: "http://example.com",
            };

            expect(() => PromptRetrieverService.retrievePrompt(validTableArgs)).not.toThrow();

            // Valid role and name prompt
            const validRoleArgs = {
                promptName: "generate_test_expect_element",
                baseUrl: "http://example.com",
                accessibleName: "button",
                accessibleRole: "toto",
            };

            expect(() => PromptRetrieverService.retrievePrompt(validRoleArgs)).not.toThrow();
        });
    });
});
