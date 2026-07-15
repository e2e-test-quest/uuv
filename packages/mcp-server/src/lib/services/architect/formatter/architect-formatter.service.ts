import { ScenarioResult, Step } from "../architect.model";
import { StepCaseEnum, TranslateSentences } from "@uuv/assistant";
import { AbstractElementService } from "../../element/abstract-element.service";
import { ClickElementService } from "../../element/click-element.service";
import { TypeElementService } from "../../element/type-element.service";
import { WithinElementService } from "../../element/within-element.service";
import { ExpectElementService } from "../../element/expect-element.service";
import { GeneralElementService } from "../../element/general-element.service";

export class ArchitectFormatterService {
    public formatScenario(scenarioResult: ScenarioResult): string {
        return `
  Scenario: ${scenarioResult.scenarioTitle}
    ${this.formatSentences(
        StepCaseEnum.GIVEN,
        scenarioResult.givenSteps.map(s => this.generateUUVGherkinStepTool(s))
    )}
    ${this.formatSentences(
        StepCaseEnum.WHEN,
        scenarioResult.whenSteps.map(s => this.generateUUVGherkinStepTool(s))
    )}
    ${this.formatSentences(
        StepCaseEnum.THEN,
        scenarioResult.thenSteps.map(s => this.generateUUVGherkinStepTool(s))
    )}
  `;
    }

    private formatSentences(mainKeyword: StepCaseEnum, input: TranslateSentences[]): string {
        return input
            .flatMap(item => item.steps)
            .reduce((acc, tag, i) => acc + (i === 0 ? `${mainKeyword} ` : `\n     ${StepCaseEnum.AND} `) + tag.sentence, "");
    }

    private generateUUVGherkinStepTool(input: Step): TranslateSentences {
        let sentenceService: AbstractElementService;
        const action = this.refineAction(input);
        if (action !== "navigation" && input.targetElement) {
            switch (action) {
                case "click":
                    sentenceService = new ClickElementService();
                    break;
                case "type":
                case "select":
                    sentenceService = new TypeElementService();
                    break;
                case "within":
                    sentenceService = new WithinElementService();
                    break;
                case "expect":
                default:
                    sentenceService = new ExpectElementService();
            }
            const valueToTypeField = action === "select" ? "valueToSelect" : "valueToType";
            return sentenceService.generateSentenceForElement({
                accessibleName: input.targetElement.accessibleName,
                // eslint-disable-next-line dot-notation
                accessibleRole: input.targetElement.accessibleRole,
                baseUrl: "fakeUrl",
                // eslint-disable-next-line dot-notation
                valueToType: (input[valueToTypeField] ?? input.targetElement.value) ?? undefined,
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

    private refineAction(input: Step) {
        // eslint-disable-next-line dot-notation
        if (input.action === "click" && input.targetElement?.accessibleRole === "combobox" && input["valueToType"]) {
            return "type";
        }
        return input.action;
    }
}
