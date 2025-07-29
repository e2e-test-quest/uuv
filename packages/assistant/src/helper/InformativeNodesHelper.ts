/**
 * Software Name : UUV
 *
 * SPDX-License-Identifier: MIT
 *
 * This software is distributed under the MIT License,
 * see the "LICENSE" file for more details
 *
 * Authors: NJAKO MOLOM Louis Fredice & SERVICAL Stanley
 * Software description: Make test writing fast, understandable by any human
 * understanding English or French.
 */

export class InformativeNodesHelper {
    private readonly TAGS_WITH_NATIVE_ACCESSIBILITY_DATA: string[] = [
        "article",
        "aside",
        "button",
        "details",
        "dialog",
        "fieldset",
        "figure",
        "form",
        "footer",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "header",
        "hr",
        "img",
        "input",
        "label",
        "li",
        "main",
        "menu",
        "nav",
        "ol",
        "ul",
        "option",
        "progress",
        "section",
        "select",
        "summary",
        "table",
        "textarea",
        "tbody",
        "thead",
        "tfoot",
        "td",
        "th",
        "tr",
    ];

    private readonly candidatesWithNativeAccessibleData: NodeListOf<Element>;
    private readonly candidatesWithCustomAccessibleData: Element[];

    constructor() {
        this.candidatesWithNativeAccessibleData = document.querySelectorAll(this.TAGS_WITH_NATIVE_ACCESSIBILITY_DATA.join(","));
        this.candidatesWithCustomAccessibleData = this.findInformativeElements(document);
    }

    private findInformativeElements(root: ParentNode): Element[] {
        const query = `*${this.TAGS_WITH_NATIVE_ACCESSIBILITY_DATA.map(tag => `:not(${tag})`).join("")}`;

        const nodes = root.querySelectorAll(query);

        const informative = [...nodes].filter(el => this.hasInformativeAttributes(el));
        const children = [...nodes].flatMap(el => Array.from(el.children));

        return [...informative, ...children];
    }

    getAvailableNodes(): Element[] {
        return [...this.candidatesWithNativeAccessibleData, ...this.candidatesWithCustomAccessibleData];
    }

    async getAvailableChildren(node: HTMLElement | Element): Promise<Element[]> {
        if (node.children.length === 1) {
            return this.getAvailableChildren(node.children[0]);
        }
        return this.findInformativeElements(node);
    }

    private hasInformativeAttributes(node: Element): boolean {
        for (const attr of Array.from(node.attributes)) {
            const name = attr.name.toLowerCase();
            const isAccessibilityAttr =
                name === "role" ||
                name === "alt" ||
                name === "title" ||
                name === "tabindex" ||
                name === "lang" ||
                name === "scope" ||
                name === "for" ||
                name.startsWith("aria-");
            const isTechnicalAttr = name === "data-testid";

            if (isAccessibilityAttr || isTechnicalAttr) {
                return true;
            }
        }
        return false;
    }

    public getDialogName(node: Element): string | null {
        const idAccessibleName = node.getAttribute("aria-labelledby");
        if (idAccessibleName) {
            return document.getElementById(idAccessibleName)?.textContent ?? null;
        }
        return node.getAttribute("aria-label") ?? node.getAttribute("title");
    }
}
