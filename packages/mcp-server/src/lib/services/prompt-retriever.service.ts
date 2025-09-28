import * as path from "node:path";
import fs from "node:fs";
import { z } from "zod";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PromptExtraArgs = Record<string, any>;

export type PromptArgs = {
    promptName: string;
} | PromptExtraArgs;

export class PromptRetrieverService {
    private static loadPromptTemplate(promptName: string): string {
        const templatePath = path.join(__dirname, "..", "prompts", `${promptName}.mustache`);
        return fs.readFileSync(templatePath, "utf8");
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private static renderPrompt(template: string, variables: Record<string, any>): string {
        let result = template;
        for (const [key, value] of Object.entries(variables)) {
            if (Array.isArray(value)) {
                // Handle array values for Mustache-style list rendering
                const listItems = value.map(item => `{{#${key}}}${item}{{/${key}}}`).join("\n");
                result = result.replaceAll(`{{#${key}}}`, listItems);
            } else {
                result = result.replaceAll(`{{${key}}}`, value);
            }
        }
        return result;
    }

    private static generatePrompt(args: PromptArgs): string {
        const template = this.loadPromptTemplate(args.promptName);
        return this.renderPrompt(template, args);
    }

    private static validatePromptGenerationRequest(args: PromptArgs) {
        const promptSchemas = z.discriminatedUnion("promptName", [
            z.object({
                promptName: z.literal("generate_table"),
                baseUrl: z.string().describe("The base URL of the page where the table/grid/treegrid is located."),
            }),
            z.object({
                promptName: z.literal("generate_role_and_name"),
                baseUrl: z.string().describe("The base URL of the page where the element is located."),
                accessibleName: z.string().describe("Accessible name of the element"),
                accessibleRole: z.string().describe("Accessible role of the element"),
            }),
        ]);

        return promptSchemas.parse(args);
    }

    public static retrievePrompt(args: PromptArgs) {
        const validatedPrompt = PromptRetrieverService.validatePromptGenerationRequest(args);
        let prompt: string;
        switch (validatedPrompt.promptName) {
            case "generate_table":
                prompt = PromptRetrieverService.generatePrompt(args);
                break;

            case "generate_role_and_name":
                prompt = PromptRetrieverService.generatePrompt(args);
                break;

            default:
                throw new Error(`Bad parameters for request ${args}`);
        }
        return prompt;
    }
}
