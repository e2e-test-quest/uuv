import { buildResultingScript, TableAndGridService, ExpectTranslator, ClickTranslator } from "@uuv/assistant";
import { JSDOM } from "jsdom";
import fs from "node:fs";

export interface ElementByRoleAndName {
    baseUrl: string;
    accessibleName: string;
    accessibleRole: string
}

export interface ElementByDomSelector {
    baseUrl: string;
    domSelector: string
}

export class ExpectService {
    public static generateExpectForElement(input: ElementByRoleAndName | ElementByDomSelector): string {
        if ( "accessibleName" in input && "accessibleRole" in input) {
            return this.generateExpectForAccessibleNameAndRole(input);
        } else if ( input satisfies ElementByDomSelector) {
            return this.generateExpectForDomSelector(input);
        }
        return "";
    }
    private static generateExpectForAccessibleNameAndRole(input: ElementByRoleAndName): string {
        const translator = new ExpectTranslator();
        const result = translator.getSentenceFromAccessibleRoleAndName(input.accessibleRole, input.accessibleName);
        return buildResultingScript("Your amazing feature name", "Action - An action", result.sentences, input.baseUrl);
    }

    private static generateExpectForDomSelector(input: ElementByDomSelector): string {
        const translator = new ExpectTranslator();
        const result = translator.getSentenceFromDomSelector(input.domSelector);
        return buildResultingScript("Your amazing feature name", "Action - An action", result.sentences, input.baseUrl);
    }

    public static generateClickForElement(input: ElementByRoleAndName | ElementByDomSelector): string {
        if ( "accessibleName" in input && "accessibleRole" in input) {
            return this.generateClickForAccessibleNameAndRole(input);
        } else if ( input satisfies ElementByDomSelector) {
            return this.generateClickForDomSelector(input);
        }
        return "";
    }
    private static generateClickForAccessibleNameAndRole(input: ElementByRoleAndName): string {
        const translator = new ClickTranslator();
        const result = translator.getSentenceFromAccessibleRoleAndName(input.accessibleRole, input.accessibleName);
        return buildResultingScript("Your amazing feature name", "Action - An action", result.sentences, input.baseUrl);
    }

    private static generateClickForDomSelector(input: ElementByDomSelector): string {
        const translator = new ClickTranslator();
        const result = translator.getSentenceFromDomSelector(input.domSelector);
        return buildResultingScript("Your amazing feature name", "Action - An action", result.sentences, input.baseUrl);
    }

    public static async generateExpectForTable(baseUrl: string, innerHtmlFilePath: string): Promise<string> {
        const tableAndGridService = new TableAndGridService();
        const dom = new JSDOM(fs.readFileSync(innerHtmlFilePath, "utf8"));
        const element = dom.window.document.body.firstElementChild;
        const result = await tableAndGridService.buildResultSentence(element as HTMLElement);
        return buildResultingScript("Your amazing feature name", "Action - Expect Array", result, baseUrl);
    }
}
