import { generateText, Output, stepCountIs, tool, zodSchema } from "ai";
import { ExplorationStepOutput, FlatScenarioResultSchema, ScenarioResult, ScenarioResultSchema, Step } from "./architect.model";
import { createOllama } from "ollama-ai-provider-v2";
import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";
import { google } from "@ai-sdk/google";
import { createMCPClient } from "@ai-sdk/mcp";
// eslint-disable-next-line camelcase
import { Experimental_StdioMCPTransport } from "@ai-sdk/mcp/mcp-stdio";
import { AbstractElementService } from "../element/abstract-element.service";
import { ClickElementService } from "../element/click-element.service";
import { TypeElementService } from "../element/type-element.service";
import { WithinElementService } from "../element/within-element.service";
import { ExpectElementService } from "../element/expect-element.service";
import { GeneralElementService } from "../element/general-element.service";
import { StepCaseEnum, TranslateSentences } from "@uuv/assistant";
import pino from "pino";
import z from "zod";

export const logger = pino({
    // eslint-disable-next-line dot-notation
    level: process.env["PINO_LOG_LEVEL"] || "info",
    transport: {
        target: "pino-pretty",
    },
});

const SYSTEM_PROMPT = `
  You are an automated testing agent with access to Playwright MCP tools.

  You MUST always follow this process in order:
  1. Call "browser_navigate" with the target URL
  2. Analyze the HTML to identify any prior steps needed before the actual test
  3. Execute each prior step using Playwright tools (browser_click, browser_fill, browser_select_option...)
  4. Then executes the input test scenario, and for each revelant html element: 
    - determine action (navigation, "expect", "type", "click", "within")
    - for html form fill all required field.
  5. After each action, re-fetch the HTML to observe the new page state when needed
  6. Finally generate a whole test scenario like the following output example:
    \`\`\`
      1 - navigation - \`https://example.com\`
      2 - click - button - \`Buy\`
      3 - type - textbox - \`Username\` - \`My username\`
      4 - expect - heading - \`Hello world\`
      4 - expect - text - \`Welcome to this app\`
    \`\`\`
`;

function filterTools(tools: Record<string, any>): Record<string, any> {
    const ALLOWED_TOOLS = new Set([
        "browser_navigate",
        "browser_snapshot",
        "browser_click",
        "browser_type",
        "browser_fill",
        "browser_select_option",
        "browser_evaluate",
    ]);
    return Object.fromEntries(Object.entries(tools).filter(([name]) => ALLOWED_TOOLS.has(name)));
}

function parsePlaywrightToolResult(text: string): Record<string, string> {
    const sections: Record<string, string> = {};
    const parts = text.split(/^### /m);

    for (const part of parts) {
        if (!part.trim()) {
continue;
}
        const newlineIndex = part.indexOf("\n");
        const title = part.slice(0, newlineIndex).trim();
        const content = part.slice(newlineIndex + 1).trim();
        sections[title] = content;
    }

    return sections;
}

async function analyzeScenario(targetUrl: string, scenario: string, tools: any, llmModel: string, llmApi?: string): Promise<string> {
    const providers = {
        openai,
        anthropic,
        google,
        ollama: createOllama({
            baseURL: llmApi,
        })
    };

    const [provider, modelName] = llmModel.split("/");
    const model = providers[provider](modelName);

    // Accumulate all step texts
    const explorationStepOutputs = await exploreTheScenario(scenario, targetUrl, model, tools);

    const { output } = await extractScenarioSteps(model, explorationStepOutputs);

    logger.debug("Raw output");
    logger.debug(output);

    return formatScenario(output as ScenarioResult);
}

async function extractScenarioSteps(model: any, explorationStepOutputs: ExplorationStepOutput[]) {
    const isJsonModelFlatModeEnabled = ["true", "1", "yes"].includes(
        // eslint-disable-next-line dot-notation
        (process.env["UUV_JSON_FLAT_MODEL_ENABLED"] || "").toLowerCase()
    );
    logger.debug("isJsonModelFlatModeEnabled");
    logger.debug(isJsonModelFlatModeEnabled);
    const schema: z.ZodTypeAny = isJsonModelFlatModeEnabled
        ? FlatScenarioResultSchema
        : ScenarioResultSchema;
    return await generateText({
        model,
        prompt: `
        Based on this full execution trace of the browser automation session, produce a structured test scenario, always start with a navigation step.
        
        Some steps were used for exploration purposes only and do not lead to any meaningful outcome (you can identify them using the "comment" field when it indicates uncertainty, dead ends, or intermediate exploration).
        Exclude those exploration-only steps from the final structured scenario and keep only the steps that are part of the actual user flow.

        Trace:
        ${JSON.stringify(explorationStepOutputs, null, 2)}

        Return JSON matching the schema.
      `,
        maxOutputTokens: 4096,
        output: Output.object({ schema: zodSchema(schema) }),
    });
}

async function exploreTheScenario(scenario: string, targetUrl: string, model: any, tools: any) {
    const stepOutputs: Record<string, string>[] = [];
    const explorationPrompt = `Generate the following usecase: \`${scenario}\`, starting by navigating to the targetUrl:\`${targetUrl}\``;
    await generateText({
        model,
        tools,
        system: SYSTEM_PROMPT,
        prompt: explorationPrompt,
        stopWhen: stepCountIs(20),
        onStepFinish({ stepNumber, text, toolCalls, toolResults, finishReason }) {
            logger.debug(`Step ${stepNumber} finished (${finishReason})`);

            let structuredOutput = {};

            // Collect every text fragment (including intermediate reasoning)
            if (text?.trim()) {
                const currenStepText = `[Step ${stepNumber}]: ${text}`;
                logger.debug(currenStepText);
                // eslint-disable-next-line dot-notation
                structuredOutput["comment"] = text;
            }

            // Log tool calls for traceability
            toolCalls?.forEach(tc => {
                const input = `${tc.toolName} - ${JSON.stringify(tc.input)}`;
                logger.debug(`  → ${input}`);
            });
            if (toolResults.length > 0) {
                toolResults?.forEach(tr => {
                    structuredOutput = {
                        ...structuredOutput,
                        ...parsePlaywrightToolResult((tr.output as any).content[0].text),
                    };
                    const input = `${tr.toolName} - ${JSON.stringify(tr.input)}`;
                    // eslint-disable-next-line dot-notation
                    structuredOutput["input"] = input;
                    if (tr.toolName !== "browser_snapshot") {
                        stepOutputs.push(structuredOutput);
                    }
                });
            } else {
                stepOutputs.push(structuredOutput);
            }

            logger.debug(`  ← ${JSON.stringify(structuredOutput)}`);
        },
    });

    // Build the full trace for the structured output LLM
    logger.debug("Full trace:");
    logger.debug(stepOutputs);
    const editedStepOutputs = stepOutputs.map(step => {
        return {
            // eslint-disable-next-line dot-notation
            comment: step["comment"],
            "Ran Playwright code": step["Ran Playwright code"],
            action: extractAction(step),
        };
    });
    logger.debug(editedStepOutputs);
    return editedStepOutputs;
}

function extractAction(step): string {
    const input = step.input || "";

    if (input.includes("browser_navigate")) {
        return "navigation";
    }

    if (input.includes("browser_click")) {
        return "click";
    }

    if (input.includes("browser_type") || input.includes("browser_select_option")) {
        return "type";
    }

    return "expect";
}

async function createMcpClient() {
    return await createMCPClient({
        transport: new Experimental_StdioMCPTransport({
            command: "npx",
            args: ["-y", "@playwright/mcp@latest"],
        }),
    });
}

function generateUUVGherkinStepTool(input: Step): TranslateSentences {
    let sentenceService: AbstractElementService;
    const action = refineAction(input);
    if (action !== "navigation") {
        switch (action) {
            case "click":
                sentenceService = new ClickElementService();
                break;
            case "type":
                sentenceService = new TypeElementService();
                break;
            case "within":
                sentenceService = new WithinElementService();
                break;
            case "expect":
            default:
                sentenceService = new ExpectElementService();
        }
        return sentenceService.generateSentenceForElement({
            // eslint-disable-next-line dot-notation
            accessibleName: input["targetElement"].accessibleName,
            // eslint-disable-next-line dot-notation
            accessibleRole: input["targetElement"].accessibleRole,
            baseUrl: "fakeUrl",
            // eslint-disable-next-line dot-notation
            valueToType: input["targetElement"].value ?? input["valueToType"],
        });
    // eslint-disable-next-line dot-notation
    } else if (input["targetUrl"]) {
        // eslint-disable-next-line dot-notation
        const sentence = new GeneralElementService().findSentenceFromKey("key.when.visit", input["targetUrl"]);
        return {
            steps: [
                {
                    keyword: StepCaseEnum.GIVEN,
                    sentence,
                },
            ],
            suggestion: undefined,
        };
    }
    return {
        steps: [],
        suggestion: undefined,
    };
}

function refineAction(input: Step) {
    // eslint-disable-next-line dot-notation
    if (input.action === "click" && input.targetElement?.accessibleRole === "combobox" && input["valueToType"]) {
        return "type";
    }
    return input.action;
}

export function validateArgs(targetUrl?: string, scenario?: string): boolean {
    if (!targetUrl || !scenario) {
        logger.error("Usage: architect <targetUrl> \"<scenario description>\"");
        logger.error("Example: architect https://make-it-soft.com \"User logs in with valid credentials\"");
        return false;
    }
    return true;
}

export async function generateScenario(targetUrl: string, scenario: string, llmModel: string, llmApi?: string): Promise<string | null> {
    logger.debug(`targetUrl: ${targetUrl} - scenario: ${scenario} - llmModel: ${llmModel} - llmApi: ${llmApi}`);
    const client = await createMcpClient();
    let response: string | null = null;
    try {
        const tools = await client.tools();
        const filteredTools = filterTools(tools);
        logger.debug("filteredTools");
        logger.debug(filteredTools);
        response = await analyzeScenario(targetUrl, scenario, filteredTools, llmModel, llmApi);
    } catch (error) {
        logger.error(error);
    } finally {
        // ensure the client is closed even if an error occurs
        if (client) {
            await client.close();
        }
    }
    return response;
}

function formatSentences(mainKeyword: StepCaseEnum, input: TranslateSentences[]): string {
    return input
        .flatMap(item => item.steps)
        .reduce((acc, tag, i) => acc + (i === 0 ? `${mainKeyword} ` : `\n     ${StepCaseEnum.AND} `) + tag.sentence, "");
}

async function formatScenario(scenarioResult: ScenarioResult): Promise<string> {
    const resp = `
  Scenario: ${scenarioResult.scenarioTitle}
    ${formatSentences(
        StepCaseEnum.GIVEN,
        scenarioResult.givenSteps.map(s => generateUUVGherkinStepTool(s))
    )}
    ${formatSentences(
        StepCaseEnum.WHEN,
        scenarioResult.whenSteps.map(s => generateUUVGherkinStepTool(s))
    )}
    ${formatSentences(
        StepCaseEnum.THEN,
        scenarioResult.thenSteps.map(s => generateUUVGherkinStepTool(s))
    )}
`;
    return resp;
}
