import { AbstractElementService } from "./abstract-element.service";
import { buildResultingScript, TypeTranslator } from "@uuv/assistant";
import { FindElementByDomSelector, FindElementByRoleAndName } from "../expect.service";

export class TypeElementService extends AbstractElementService {
    override generateTestForAccessibleNameAndRole(input: FindElementByRoleAndName): string {
        const translator: TypeTranslator = new TypeTranslator();
        translator.useValueAsMockData = false;
        const result = translator.getSentenceFromAccessibleRoleAndName(input.accessibleRole, input.accessibleName);
        return buildResultingScript("Your amazing feature name", "Action - An action", result.sentences, input.baseUrl);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    override generateTestForDomSelector(input: FindElementByDomSelector): string {
        throw Error("Not implemented yet");
    }
}
