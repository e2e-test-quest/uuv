import { TranslateSentences, buildResultingScript, getSentencesAsStringArray } from "@uuv/assistant";
import { FindElementByDomSelector, FindElementByRoleAndName } from "../expect.service";

export abstract class AbstractElementService {
    generatedFeatureName!: string;
    generatedScenarioName!: string;

    public generateTestForElement(input: FindElementByRoleAndName | FindElementByDomSelector): string {
        const result = this.generateSentenceForElement(input);
        return buildResultingScript(this.generatedFeatureName, this.generatedScenarioName, getSentencesAsStringArray(result), input.baseUrl);
    }

    public generateSentenceForElement(input: FindElementByRoleAndName | FindElementByDomSelector): TranslateSentences {
        if ((input as FindElementByRoleAndName).accessibleName && (input as FindElementByRoleAndName).accessibleRole) {
            return this.generateSentenceForAccessibleNameAndRole(input as FindElementByRoleAndName);
        } else if ((input as FindElementByDomSelector).domSelector) {
            return this.generateSentenceForDomSelector(input as FindElementByDomSelector);
        } else {
            throw new Error(`Case for input ${input} not implemented yet`);
        }
    }

    protected abstract generateSentenceForAccessibleNameAndRole(input: FindElementByRoleAndName): TranslateSentences;

    protected abstract generateSentenceForDomSelector(input: FindElementByDomSelector): TranslateSentences;
}
