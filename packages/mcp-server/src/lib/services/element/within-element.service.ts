import { AbstractElementService } from "./abstract-element.service";
import { TranslateSentences, WithinTranslator } from "@uuv/assistant";
import { FindElementByDomSelector, FindElementByRoleAndName } from "../expect.service";

export class WithinElementService extends AbstractElementService {
    override generatedFeatureName = "Your amazing feature name";
    override generatedScenarioName = "Within an element";


    override generateSentenceForAccessibleNameAndRole(input: FindElementByRoleAndName): TranslateSentences {
        const translator = new WithinTranslator();
        return translator.getSentenceFromAccessibleRoleAndName(input.accessibleRole, input.accessibleName);
    }

    override generateSentenceForDomSelector(input: FindElementByDomSelector): TranslateSentences {
        const translator = new WithinTranslator();
        return translator.getSentenceFromDomSelector(input.domSelector);
    }
}
