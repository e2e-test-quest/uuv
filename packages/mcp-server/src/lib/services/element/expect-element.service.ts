import { AbstractElementService } from "./abstract-element.service";
import { ExpectTranslator, TranslateSentences, TextualTranslator } from "@uuv/assistant";
import { FindElementByDomSelector, FindElementByRoleAndName } from "../expect.service";

export class ExpectElementService extends AbstractElementService {
    override generatedFeatureName = "Your amazing feature name";
    override generatedScenarioName = "Expect an element";

    override generateSentenceForAccessibleNameAndRole(input: FindElementByRoleAndName): TranslateSentences {
        if ((input.accessibleRole === "text" || input.valueToType === "") && input.valueToType) {
            return TextualTranslator.computeTextContentSentence(input.valueToType);
        } else if ((input.accessibleRole === "page_title" || input.valueToType === "") && input.valueToType) {
            return TextualTranslator.computeSentenceFromKeyAndContent("key.then.page.withTitle", input.accessibleName);
        } else {
            return new ExpectTranslator().getSentenceFromAccessibleRoleAndName(input.accessibleRole, input.accessibleName);
        }
    }

    override generateSentenceForDomSelector(input: FindElementByDomSelector): TranslateSentences {
        const translator = new ExpectTranslator();
        return translator.getSentenceFromDomSelector(input.domSelector);
    }
}
