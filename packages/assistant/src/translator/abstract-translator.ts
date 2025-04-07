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

import { computeAccessibleName, getRole } from "dom-accessibility-api";
import { BaseSentence, EnrichedSentence, EnrichedSentenceRole, EnrichedSentenceWrapper, Suggestion, TranslateSentences } from "./model";
import { EN_ROLES, enBasedRoleSentences, enSentences } from "@uuv/runner-commons/wording/web/en";

export abstract class Translator {
    protected jsonBase: BaseSentence[] = enSentences;
    protected jsonEnriched: EnrichedSentenceWrapper = enBasedRoleSentences;
    protected selectedHtmlElem!: HTMLElement | SVGElement;

    public async translate(htmlElem: HTMLElement | SVGElement): Promise<TranslateSentences> {
        const accessibleRole = getRole(htmlElem);
        const accessibleName = computeAccessibleName(htmlElem);
        this.selectedHtmlElem = htmlElem;

        let response = {
            suggestion: undefined,
            sentences: []
        } as TranslateSentences;
        if (htmlElem.getAttribute("type") !== "hidden") {
            if (accessibleRole && accessibleName) {
                const content = htmlElem instanceof HTMLInputElement || htmlElem instanceof HTMLTextAreaElement ? htmlElem.value : htmlElem.getAttribute("value") ?? htmlElem.firstChild?.textContent?.trim();
                if (content) {
                    response = this.getSentenceFromAccessibleRoleAndNameAndContent(
                        accessibleRole,
                        accessibleName,
                        content
                    );
                } else {
                    response = this.getSentenceFromAccessibleRoleAndName(
                        accessibleRole,
                        accessibleName
                    );
                }
            } else {
                response = this.getSentenceFromDomSelector(htmlElem);
                response.suggestion = new Suggestion();
            }

        }
        return response;
    }

    abstract getSentenceFromDomSelector(htmlElem: HTMLElement | SVGElement): TranslateSentences;

    abstract getSentenceFromAccessibleRoleAndName(accessibleRole: string, accessibleName: string): TranslateSentences;

    // eslint-disable-next-line max-len
    abstract getSentenceFromAccessibleRoleAndNameAndContent(accessibleRole: string, accessibleName: string, content: string): TranslateSentences;

    /* eslint-disable  @typescript-eslint/no-explicit-any */
    protected getSelector(element: any) {
        const path: string[] = [];
        while (element.nodeType === Node.ELEMENT_NODE) {
            let selector: string = element.nodeName.toLowerCase();
            if (element.id) {
                selector += "#" + element.id;
                path.unshift(selector);
                break;
            } else if (element.getAttribute("data-testid")) {
                selector += `[data-testid=${element.getAttribute("data-testid")}]`;
                path.unshift(selector);
                break;
            } else {
                let sibling = element.previousSibling;
                let index = 1;
                while (sibling) {
                    if (sibling.nodeType === Node.ELEMENT_NODE && sibling.nodeName.toLowerCase() === selector) {
                        index++;
                    }
                    sibling = sibling.previousSibling;
                }
                if (index > 1  || element.nextSibling) {
                    selector += ":nth-of-type(" + index + ")";
                }
            }
            path.unshift(selector);
            element = element.parentNode;
        }
        return path.join(" > ");
    }

    protected initResponse(): TranslateSentences {
        return {
            suggestion: undefined,
            sentences: []
        };
    }

    protected computeSentenceFromKeyRoleAndName(computedKey: string, accessibleRole: string, accessibleName: string) {
        return this.jsonEnriched.enriched
            .filter((value: EnrichedSentence) => value.key === computedKey)
            .map((enriched: EnrichedSentence) => {
                const sentenceAvailable = enriched.wording;
                const role = EN_ROLES.filter((role: EnrichedSentenceRole) => role.id === accessibleRole)[0];
                return sentenceAvailable
                    .replaceAll("(n)", "")
                    .replaceAll("$roleName", role?.name ?? accessibleRole)
                    .replaceAll("$definiteArticle", role?.getDefiniteArticle())
                    .replaceAll("$indefiniteArticle", role?.getIndefiniteArticle())
                    .replaceAll("$namedAdjective", role?.namedAdjective())
                    .replaceAll("$ofDefiniteArticle", role?.getOfDefiniteArticle())
                    .replace("{string}", `"${accessibleName}"`);
            })[0];
    }

    protected computeSentenceFromKeyRoleNameAndContent(computedKey: string, accessibleRole: string, accessibleName: string, content: string) {
        return this.jsonEnriched.enriched
            .filter((value: EnrichedSentence) => value.key === computedKey)
            .map((enriched: EnrichedSentence) => {
                const sentenceAvailable = enriched.wording;
                const role = EN_ROLES.filter((role: EnrichedSentenceRole) => role.id === accessibleRole)[0];
                return sentenceAvailable
                    .replaceAll("(n)", "")
                    .replaceAll("$roleName", role?.name ?? accessibleRole)
                    .replaceAll("$definiteArticle", role?.getDefiniteArticle())
                    .replaceAll("$indefiniteArticle", role?.getIndefiniteArticle())
                    .replaceAll("$namedAdjective", role?.namedAdjective())
                    .replaceAll("$ofDefiniteArticle", role?.getOfDefiniteArticle())
                    .replace("{string}", `"${accessibleName}"`)
                    .replace("{string}", `"${content}"`);
            })[0];
    }

    protected computeSentenceFromKeyAndSelector(computedKey: string, selector: string) {
        return this.jsonBase
            .filter((el: BaseSentence) => el.key === computedKey)
            .map((el: BaseSentence) =>
                el.wording.replace("{string}", `"${selector}"`)
            )[0];
    }

    public getSentenceFromKey(key: string) {
        return this.jsonBase.filter((el: BaseSentence) => el.key === key)[0];
    }
}
