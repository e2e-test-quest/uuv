import { buildResultingScript, TableAndGridService } from "@uuv/assistant";
import { JSDOM } from "jsdom";
import fs from "node:fs";
import { ClickElementService } from "./element/click-element.service";
import { TypeElementService } from "./element/type-element.service";
import { AbstractElementService } from "./element/abstract-element.service";
import { WithinElementService } from "./element/within-element.service";
import { ExpectElementService } from "./element/expect-element.service";

export type FindElementByRoleAndName = {
    baseUrl: string;
    accessibleName: string;
    accessibleRole: string;
};

export type FindElementByDomSelector = {
    baseUrl: string;
    domSelector: string;
};

export type FindElement = FindElementByRoleAndName & FindElementByDomSelector;

export enum ElementServiceType {
    EXPECT,
    CLICK,
    TYPE,
    WITHIN,
}

export function getElementService(serviceType: ElementServiceType): AbstractElementService {
    switch (serviceType) {
        case ElementServiceType.CLICK:
            return new ClickElementService();
        case ElementServiceType.TYPE:
            return new TypeElementService();
        case ElementServiceType.WITHIN:
            return new WithinElementService();
        case ElementServiceType.EXPECT:
        default:
            return new ExpectElementService();
    }
}

export class ExpectTableService {
    public static async generateExpectForTable(baseUrl: string, innerHtmlFilePath: string): Promise<string> {
        const tableAndGridService = new TableAndGridService();
        const dom = new JSDOM(fs.readFileSync(innerHtmlFilePath, "utf8"));
        const element = dom.window.document.body.firstElementChild;
        const result = await tableAndGridService.buildResultSentence(element as HTMLElement);
        return buildResultingScript("Your amazing feature name", "Action - Expect Array", result, baseUrl);
    }
}
