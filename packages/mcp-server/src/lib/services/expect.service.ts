import { buildResultingScript, TableAndGridService, ExpectTranslator } from "@uuv/assistant";
import { JSDOM } from "jsdom";
import fs from "node:fs";

export class ExpectService {
    public static generateExpectForAccessibleNameAndRole(baseUrl: string, accessibleName: string, accessibleRole: string): string {
        const translator = new ExpectTranslator();
        const result = translator.getSentenceFromAccessibleRoleAndName(accessibleRole, accessibleName);
        return buildResultingScript("Your amazing feature name", "Action - An action", result.sentences, baseUrl);
    }

    public static async generateExpectForTable(baseUrl: string, innerHtmlFilePath: string): Promise<string> {
        const tableAndGridService = new TableAndGridService();
        const dom = new JSDOM(fs.readFileSync(innerHtmlFilePath, "utf8"));
        const element = dom.window.document.body.firstElementChild;
        const result = await tableAndGridService.buildResultSentence(element as HTMLElement);
        return buildResultingScript("Your amazing feature name", "Action - Expect Array", result, baseUrl);
    }
}
