import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { chromium } from "playwright-chromium";
import { FlatScenarioResultSchema, FlatStepSchema, ScenarioResult, ScenarioResultSchema, Step } from "../architect.model";
import { HumanMessage, SystemMessage } from "langchain";
import { LangWatchCallbackHandler } from "langwatch/observability/instrumentation/langchain";
import { ArchitectExplorerHelper } from "./architect-explorer.helper";
import { getBooleanEnv, logger } from "../../utils";

const EXPLORATION_SYSTEM_PROMPT = `
 You are an automated testing agent with access to Playwright Web Snapshot.
 
 To determine the next action based on 'accessible name' and 'accessible role' of the target element.
 
 Output ONLY valid JSON.
 
 CRITICAL RULE for extracting "Accessible Name":
    - In the snapshot:
        - accRole: "Accessible Role"
        - accName: "Accessible Name"
        - otherAttrs may contains additionals informations like "field value" or "heading level"

 WORKFLOW RULES:
    1. To CHANGE state (fill form, click, select): Use "click", "type", or "select" actions. No need of separate verification step between actions, simply execute the next interaction based on the updated snapshot.
    2. To VERIFY content on a final view (e.g. "Check contact page"): Output "expect" actions of relevant elements based on pageSnapshot BEFORE "stop".
    3. If the original scenario goal has been fully achieved, immediately output {"action": "stop", ...}. DO NOT continue or add unnecessary steps.
`;

export class ArchitectExplorerService {
    private readonly langWatchCallbackHandler!: LangWatchCallbackHandler;

    constructor(
        private readonly model: BaseChatModel,
        private readonly isBrowserHeadless: boolean
    ) {
        this.langWatchCallbackHandler = new LangWatchCallbackHandler();
    }

    async explore(targetUrl: string, scenario: string, maxStep = 50): Promise<Step[]> {
        const browser = await chromium.launch({ headless: this.isBrowserHeadless });
        const page = await browser.newPage();
        const actionHistory: Step[] = [];

        try {
            const currentPageSnapshot = await ArchitectExplorerHelper.navigateToUrl(page, targetUrl);
            const initialNavigationStep: Step = {
                stepNumber: 0,
                action: "navigation",
                targetUrl: targetUrl,
                stepComment: "Start browsing",
                valueToSelect: null,
                valueToType: null,
                targetElement: null,
                result: {
                    type: "success",
                    error: null,
                    pageSnapshot: ArchitectExplorerHelper.parseAriaSnapshot(currentPageSnapshot),
                },
            };

            logger.debug("initialNavigationStep");
            logger.debug(initialNavigationStep);

            let nextStep: Step = initialNavigationStep;
            actionHistory.push(nextStep);
            while (nextStep.action !== "stop" && actionHistory.length < maxStep) {
                const explorationPrompt = this.buildUserPrompt(scenario, actionHistory);

                const nextStepRaw = await this.model
                    .withStructuredOutput(FlatStepSchema)
                    .withConfig({
                        callbacks: [this.langWatchCallbackHandler],
                    })
                    .invoke([new SystemMessage(EXPLORATION_SYSTEM_PROMPT), new HumanMessage(explorationPrompt)]);

                nextStep = {
                    ...nextStepRaw,
                    result: {
                        type: "todo",
                        pageSnapshot: null,
                        error: null,
                    },
                };

                logger.debug("nextAction: ");
                logger.debug(JSON.stringify(nextStep, null, 4),);
                nextStep = ArchitectExplorerHelper.refactorNextStep(actionHistory, nextStep);
                logger.debug("refactoredNextStep: ");
                logger.debug(JSON.stringify(nextStep, null, 4));

                nextStep.result = await ArchitectExplorerHelper.executeStep(page, nextStep);

                logger.debug("nextStep.result: ");
                logger.debug(JSON.stringify(nextStep.result, null, 4));

                actionHistory.push(nextStep);
            }

            logger.debug("result");
            logger.debug(JSON.stringify(actionHistory, null, 2));
        } catch (e) {
            logger.error(e);
            throw e;
        } finally {
            await page.close();
            await browser.close();
        }
        return actionHistory;
    }

    async buildScenario(explorationSteps: Step[]): Promise<ScenarioResult> {
        const isJsonModelFlatModeEnabled = getBooleanEnv("UUV_JSON_FLAT_MODEL_ENABLED");
        logger.debug("isJsonModelFlatModeEnabled");
        logger.debug(isJsonModelFlatModeEnabled);
        const schemaToUse = isJsonModelFlatModeEnabled ? FlatScenarioResultSchema : ScenarioResultSchema;

        const scenarioResult = await this.model
            .withStructuredOutput(schemaToUse)
            .withConfig({
                callbacks: [this.langWatchCallbackHandler],
            })
            .invoke([
                new SystemMessage(`
            /nothink
            You are a test scenario architect.
            CRITICAL RULES:
                - NEVER invent, hallucinate, or assume steps that are not supported by the exploration traces.
                - If an action was not performed during exploration, it MUST NOT appear in the final scenario.
                - Only reorganize, deduplicate, and clarify the steps that were actually executed.
        `),
                new HumanMessage(`
            Based on this full exploration trace of the browser automation session, produce a structured test scenario, always start with a navigation step.
            
            Some steps were used for exploration purposes only and do not lead to any meaningful outcome (you can identify them using the "comment" field when it indicates uncertainty, dead ends, or intermediate exploration).
            Exclude those exploration-only steps from the final structured scenario and keep only the steps that are part of the actual user flow.
    
            Exploration traces:
            ${JSON.stringify(explorationSteps)}        
        `),
            ]);

        logger.debug("scenarioResult");
        logger.debug(scenarioResult);

        return scenarioResult;
    }

    private buildUserPrompt(scenario: string, actionHistory: Step[]) {
        return `
                Determine the next action to achieve the scenario: "${scenario}" based on : 
                    - Previous actions: ${JSON.stringify(
                        actionHistory.map(action => {
                            return {
                                ...action,
                                pageSnapshot: null,
                            };
                        })
                    )} 
                    - Current page snapshot: ${actionHistory.at(-1)?.result.pageSnapshot}
                
                EXAMPLE:
                    - FOR COMBOBOX: If the snapshot contains:
                         - text "Favorite meal *"
                         - combobox "Favorite meal"
                            - option "empty" [selected]
                            - option "Chilli con carne"
                            - option "Paella"
                        Then the next action should be like { "action": "select"  "targetElement": { "accessibleName": "Favorite meal", "accessibleRole": "combobox", "value": null }, "valueToSelect": "Chilli con carne"}
            `;
    }
}
