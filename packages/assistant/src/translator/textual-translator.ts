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

import { StepCaseEnum, TranslateSentences } from "./model";
import { ExpectTranslator } from "./expect-translator";

const stepCase = StepCaseEnum.THEN;

export class TextualTranslator {
    static computeSentence(element: HTMLElement | SVGElement | Element): Promise<TranslateSentences | null> {
        if (!this.isTextualNode(element)) {
            return Promise.resolve(null);
        }
        
        const textContent = this.getTextContent(element);
        const response: TranslateSentences = TextualTranslator.computeTextContentSentence(textContent);
        return Promise.resolve(response);
    }

    static computeTextContentSentence(textContent: string) {
        const sentenceKey = "key.then.element.withContent";
        const response: TranslateSentences = {
            suggestion: undefined,
            steps: []
        };
        response.steps = [
            {
                keyword: stepCase,
                sentence: new ExpectTranslator().computeSentenceFromKeyAndContent(sentenceKey, textContent)
            }
        ];
        return response;
    }

    static isTextualNode(element: HTMLElement | SVGElement | Element): boolean {
        return [
            "caption",
            "code",
            "del",
            "em",
            "span",
            "div",
            "ins",
            "p",
            "strong",
            "sub",
            "sup"
        ].includes(element.tagName.toLowerCase())
            && element.childNodes.length === 1
            && element.childNodes[0].nodeName.toLowerCase() === "#text";
    }

    static getTextContent(element: HTMLElement | SVGElement | Element): string {
        return element?.childNodes[0].textContent ?? "";
    }
}
