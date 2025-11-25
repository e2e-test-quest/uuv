import { AbstractElementService } from "./abstract-element.service";
import { buildResultingScript, ClickTranslator } from "@uuv/assistant";
import { FindElementByDomSelector, FindElementByRoleAndName } from "../expect.service";

export class ClickElementService extends AbstractElementService {
    override generateTestForAccessibleNameAndRole(input: FindElementByRoleAndName): string {
        const translator = new ClickTranslator();
        const result = translator.getSentenceFromAccessibleRoleAndName(input.accessibleRole, input.accessibleName);
        return buildResultingScript("Your amazing feature name", "Action - An action", result.sentences, input.baseUrl);
    }

    override generateTestForDomSelector(input: FindElementByDomSelector): string {
        const translator = new ClickTranslator();
        const result = translator.getSentenceFromDomSelector(input.domSelector);
        return buildResultingScript("Your amazing feature name", "Action - An action", result.sentences, input.baseUrl);
    }
}
