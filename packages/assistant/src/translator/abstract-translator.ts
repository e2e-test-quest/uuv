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
import { BaseSentence, Suggestion, TranslateSentences } from "./model";
import { EnDictionary } from "@uuv/dictionary";

export abstract class Translator {
    protected dictionary = new EnDictionary();
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
                const isInputHtmlOrTextArea = htmlElem instanceof HTMLInputElement || htmlElem instanceof HTMLTextAreaElement;
                const content = isInputHtmlOrTextArea ?
                    /* eslint-disable  @typescript-eslint/no-explicit-any */
                    (htmlElem as any).value :
                    htmlElem.getAttribute("value") ?? htmlElem.firstChild?.textContent?.trim();
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
    static getSelector(element: any) {
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
        return this.dictionary.getRoleBasedSentencesTemplate()
            .filter(value => value.key === computedKey)
            .map(sentence => {
                return this.dictionary.computeSentence({
                    sentence,
                    accessibleRole,
                    parameters: [ accessibleName ]
                });
            })[0];
    }

    protected computeSentenceFromKeyRoleNameAndContent(computedKey: string, accessibleRole: string, accessibleName: string, content: string) {
        return this.dictionary.getRoleBasedSentencesTemplate()
            .filter(value => value.key === computedKey)
            .map(sentence => {
                return this.dictionary.computeSentence({
                    sentence,
                    accessibleRole,
                    parameters: [ accessibleName, content ]
                });
            })[0];
    }

    protected computeSentenceFromKeyAndSelector(computedKey: string, selector: string) {
        return this.dictionary.getBaseSentences()
            .filter((el: BaseSentence) => el.key === computedKey)
            .map((el: BaseSentence) =>
                el.wording.replace("{string}", `"${selector}"`)
            )[0];
    }
    public computeSentenceFromKeyAndContent(computedKey: string, content: string) {
        return this.computeSentenceFromKeyAndSelector(computedKey, content);
    }

    public getSentenceFromKey(key: string) {
        return this.dictionary.getBaseSentences().filter((el: BaseSentence) => el.key === key)[0];
    }
}
