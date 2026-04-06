import { AbstractElementService } from "./abstract-element.service";
import { ClickTranslator, TranslateSentences } from "@uuv/assistant";
import { FindElementByDomSelector, FindElementByRoleAndName } from "../expect.service";

export class ClickElementService extends AbstractElementService {
    override generatedFeatureName = "Your amazing feature name";
    override generatedScenarioName = "Action - Click on element";

    override generateSentenceForAccessibleNameAndRole(input: FindElementByRoleAndName): TranslateSentences {
        const translator = new ClickTranslator();
        return translator.getSentenceFromAccessibleRoleAndName(input.accessibleRole, input.accessibleName);
    }

    override generateSentenceForDomSelector(input: FindElementByDomSelector): TranslateSentences {
        const translator = new ClickTranslator();
        return translator.getSentenceFromDomSelector(input.domSelector);
    }
}
