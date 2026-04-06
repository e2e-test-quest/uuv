import { AbstractElementService } from "./abstract-element.service";
import { TranslateSentences, TypeTranslator } from "@uuv/assistant";
import { FindElementByDomSelector, FindElementByRoleAndName } from "../expect.service";

export class TypeElementService extends AbstractElementService {
    override generatedFeatureName = "Your amazing feature name";
    override generatedScenarioName = "Action - Type into field";

    override generateSentenceForAccessibleNameAndRole(input: FindElementByRoleAndName): TranslateSentences {
        const translator: TypeTranslator = new TypeTranslator();
        if (input.valueToType) {
            translator.mockData = input.valueToType;
        } else {
            translator.useValueAsMockData = false;
        }
        return translator.getSentenceFromAccessibleRoleAndName(input.accessibleRole, input.accessibleName);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    override generateSentenceForDomSelector(input: FindElementByDomSelector): TranslateSentences {
        throw Error("Not implemented yet");
    }
}
