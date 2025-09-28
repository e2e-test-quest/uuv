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
    private readonly INTERESTING_TAGS = ["P", "H1", "H2", "H3", "H4", "H5", "H6", "BUTTON", "A", "LABEL", "STRONG", "DIV", "SPANz"];

    private readonly candidatesWithNativeAccessibleData: NodeListOf<Element>;
    private readonly candidatesWithCustomAccessibleData: Element[];

    constructor() {
        this.candidatesWithNativeAccessibleData = document.querySelectorAll(this.TAGS_WITH_NATIVE_ACCESSIBILITY_DATA.join(","));
        this.candidatesWithCustomAccessibleData = this.findInformativeElements(document);
    }

    /**
     * Trouve l'élément parent le plus pertinent pour l'analyse d'accessibilité
     * @param {HTMLElement} element - L'élément de départ
     * @returns {HTMLElement|null} - L'élément parent pertinent ou null si non trouvé
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    findRelevantAccessibilityParent(element: any): HTMLElement | null {
        if (!element || !(element instanceof HTMLElement)) {
            return null;
        }

        // Éléments considérés comme pertinents pour l'accessibilité (par ordre de priorité)
        const relevantElements = [
            // Éléments sectionnels et structurels
            "section", "article", "aside", "nav", "main", "header", "footer",
            // Éléments de contenu
            "p", "div", "span",
            // Éléments de liste
            "ul", "ol", "li", "dl", "dt", "dd",
            // Éléments de formulaire
            "form", "fieldset", "legend",
            // Éléments de tableau
            "table", "thead", "tbody", "tfoot", "tr", "td", "th",
            // Autres éléments structurels
            "blockquote", "figure", "figcaption", "details", "summary"
        ];

        // Éléments avec des rôles ARIA pertinents
        const relevantAriaRoles = [
            "banner", "navigation", "main", "complementary", "contentinfo",
            "region", "article", "section", "group", "list", "listitem",
            "table", "row", "cell", "columnheader", "rowheader",
            "form", "search", "dialog", "alertdialog", "alert"
        ];

        let currentElement = element.parentElement;
        let bestMatch: HTMLElement | null = null;
        let bestPriority = Infinity;

        while (currentElement) {
            const tagName = currentElement.tagName.toLowerCase();
            const role = currentElement.getAttribute("role");

            // Vérifier si l'élément a un rôle ARIA pertinent
            if (role && relevantAriaRoles.includes(role)) {
                const priority = relevantAriaRoles.indexOf(role);
                if (priority < bestPriority) {
                    bestMatch = currentElement;
                    bestPriority = priority;
                }
            }

            // Vérifier si l'élément est dans notre liste d'éléments pertinents
            const elementIndex = relevantElements.indexOf(tagName);
            if (elementIndex !== -1 && elementIndex < bestPriority) {
                bestMatch = currentElement;
                bestPriority = elementIndex;
            }

            // Vérifier les attributs d'accessibilité importants
            if (currentElement.hasAttribute("aria-label") ||
                currentElement.hasAttribute("aria-labelledby") ||
                currentElement.hasAttribute("aria-describedby")) {

                // Donner une priorité plus élevée aux éléments avec des labels d'accessibilité
                const accessibilityPriority = bestPriority - 0.5;
                if (accessibilityPriority < bestPriority) {
                    bestMatch = currentElement;
                    bestPriority = accessibilityPriority;
                }
            }

            // Arrêter la recherche si on trouve un élément très pertinent
            if (["section", "article", "main", "nav", "form"].includes(tagName) ||
                (role && ["main", "navigation", "banner", "contentinfo"].includes(role))) {
                break;
            }

            currentElement = currentElement.parentElement;
        }

        return bestMatch;
    }

    extractContextForElement(element: Element): { parentElement: HTMLElement | null; htmlContext: string; siblingText: string } {
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
            parentElement: element.parentElement,
            htmlContext: element.parentElement!.outerHTML,
            siblingText,
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
