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

    // fIXME SSE transformer en role
    private readonly INTERESTING_TAGS = ["P", "H1", "H2", "H3", "H4", "H5", "H6", "BUTTON", "A", "LABEL"];

    private readonly candidatesWithNativeAccessibleData: NodeListOf<Element>;
    private readonly candidatesWithCustomAccessibleData: Element[];

    constructor() {
        this.candidatesWithNativeAccessibleData = document.querySelectorAll(this.TAGS_WITH_NATIVE_ACCESSIBILITY_DATA.join(","));
        this.candidatesWithCustomAccessibleData = this.findInformativeElements(document);
    }

    extractContextForElement(element: Element): { htmlContext: string; siblingText: string } {
        const siblingText = Array.from(element.parentElement?.childNodes || [])
            .filter((n) => {
                const isTextNode = n.nodeType === 3;
                return isTextNode && n.textContent?.trim();
            })
            .map((n) => n.textContent?.trim())
            .join(" ");

        let fragment = this.getSiblingsFragment(element, 1);

        const prev = element.parentElement?.previousElementSibling;
        if (prev && this.INTERESTING_TAGS.includes(prev.tagName)) {
            fragment = prev.outerHTML + "\n" + fragment;
        }

        return {
            htmlContext: fragment,
            siblingText
        };
    }

    getSiblingsFragment(element: Element, maxSiblings = 1): string {
        const parent = element.parentElement;
        if (!parent) {
            return element.outerHTML;
        }

        const children = Array.from(parent.children);
        const index = children.indexOf(element);

        const beforeEls = children.slice(Math.max(0, index - maxSiblings), index);
        const afterEls = children.slice(index + 1, index + 1 + maxSiblings);

        function processElement(informativeNodesHelper: InformativeNodesHelper, el: Element): string {
            if (informativeNodesHelper.INTERESTING_TAGS.includes(el.tagName)) {
                return el.outerHTML;
            }
            if (informativeNodesHelper.isStructuralOnly(el)) {
                return informativeNodesHelper.extractInterestingChildren(el).join("\n");
            }
            return "";
        }

        const before = beforeEls.map(value => processElement(this, value)).filter(Boolean);
        const after = afterEls.map(value => processElement(this, value)).filter(Boolean);

        return [...before, element.outerHTML, ...after].join("\n");
    }

    private extractInterestingChildren(el: Element): string[] {
        const collected: string[] = [];
        for (const child of Array.from(el.children)) {
            if (this.INTERESTING_TAGS.includes(child.tagName)) {
                collected.push(child.outerHTML);
            } else if (this.isStructuralOnly(child)) {
                collected.push(...this.extractInterestingChildren(child));
            }
        }
        return collected;
    }

    private isStructuralOnly(el: Element): boolean {
        const tag = el.tagName;
        const isStructuralTag = ["DIV", "SPAN", "SECTION", "MAIN", "BODY"].includes(tag);
        return isStructuralTag && !this.hasInformativeAttributes(el);
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
