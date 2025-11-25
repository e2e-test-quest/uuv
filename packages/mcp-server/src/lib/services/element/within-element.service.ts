import { AbstractElementService } from "./abstract-element.service";
import { buildResultingScript, WithinTranslator } from "@uuv/assistant";
import { FindElementByDomSelector, FindElementByRoleAndName } from "../expect.service";

export class WithinElementService extends AbstractElementService {
    override generateTestForAccessibleNameAndRole(input: FindElementByRoleAndName): string {
        const translator = new WithinTranslator();
        const result = translator.getSentenceFromAccessibleRoleAndName(input.accessibleRole, input.accessibleName);
        return buildResultingScript("Your amazing feature name", "Action - An action", result.sentences, input.baseUrl);
    }

    override generateTestForDomSelector(input: FindElementByDomSelector): string {
        const translator = new WithinTranslator();
        const result = translator.getSentenceFromDomSelector(input.domSelector);
        return buildResultingScript("Your amazing feature name", "Action - An action", result.sentences, input.baseUrl);
    }
}
