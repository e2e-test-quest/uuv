import { StepCaseEnum } from "../translator/model";

const regexThen = new RegExp(`^${StepCaseEnum.THEN}`, "g");
const regexWhen = new RegExp(`^${StepCaseEnum.WHEN}`, "g");

export function buildResultingScript(featureName: string, scenarioName: string, generatedScriptStep: string[], baseUrl: string) {
    let completeResultingScript = `Feature: ${featureName}\n`;
    completeResultingScript = completeResultingScript + `  Scenario: ${scenarioName}\n`;
    completeResultingScript = completeResultingScript + `    Given I visit path "${baseUrl}"\n`;
    let isThereAlreadyAThen = false;
    let isThereAlreadyAWhen = false;
    generatedScriptStep.forEach((step) => {
        let sanitizedStep = step;
        if (isThereAlreadyAThen) {
            sanitizedStep = sanitizedStep.replace(regexThen, StepCaseEnum.AND);
        } else {
            isThereAlreadyAThen = step.match(regexThen) != null;
        }
        if (isThereAlreadyAWhen) {
            sanitizedStep = sanitizedStep.replace(regexWhen, StepCaseEnum.AND);
        } else {
            isThereAlreadyAWhen = step.match(regexWhen) != null;
        }
        completeResultingScript = completeResultingScript + `    ${sanitizedStep}\n`;
    });
    return completeResultingScript;
}
