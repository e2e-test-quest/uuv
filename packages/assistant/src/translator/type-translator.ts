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

import { Translator } from "./abstract-translator";
import { BaseSentence, EnrichedSentence, StepCaseEnum, TranslateSentences } from "./model";

const stepCase = StepCaseEnum.WHEN;

export class TypeTranslator extends Translator {
    private _useValueAsMockData = true;


    set useValueAsMockData(value: boolean) {
        this._useValueAsMockData = value;
    }

    override getSentenceFromAccessibleRoleAndName(accessibleRole: string, accessibleName: string): TranslateSentences {
        const response = this.initResponse();
        response.sentences = this.buildSentencesWithRoleAndName(accessibleRole, accessibleName, this._useValueAsMockData);
        return response;
    }

    override getSentenceFromAccessibleRoleAndNameAndContent(
        accessibleRole: string,
        accessibleName: string,
        content: string
    ): TranslateSentences {
        const response = this.initResponse();
        const computedKey = accessibleRole === "textbox" ? "key.when.type" : "key.when.enter";
        const sentence = this.computeSentenceFromKeyRoleNameAndContent(computedKey, accessibleRole, accessibleName, content);
        response.sentences = [
            stepCase + sentence,
        ];
        return response;
    }

    override getSentenceFromDomSelector(domSelector: string, htmlElem?: HTMLElement | SVGElement): TranslateSentences {
        const response = this.initResponse();
        const computedKey = "key.when.withinElement.selector";
        const sentence = this.computeSentenceFromKeyAndSelector(computedKey, domSelector);
        const clickSentence: BaseSentence = this.getSentenceFromKey("key.when.type.withContext");
        const resetContextSentence: BaseSentence = this.getSentenceFromKey("key.when.resetContext");
        const isInputHtmlorTextArea = htmlElem instanceof HTMLInputElement || htmlElem instanceof HTMLTextAreaElement;
        const content = isInputHtmlorTextArea ?
            /* eslint-disable  @typescript-eslint/no-explicit-any */
            (htmlElem as any).value :
            htmlElem?.getAttribute("value") ?? htmlElem?.firstChild?.textContent?.trim();
        response.sentences = [
            stepCase + sentence,
            StepCaseEnum.AND + clickSentence.wording.replace("{string}", this.getMockedDataForHtmlElement(htmlElem!, content)),
            StepCaseEnum.AND + resetContextSentence.wording
        ];
        return response;
    }

    override computeSentenceFromKeyRoleNameAndContent(computedKey: string, accessibleRole: string, accessibleName: string, content: string) {
        return this.dictionary.getRoleBasedSentencesTemplate()
            .filter((value: EnrichedSentence) => value.key === computedKey)
            .map(sentence => {
                return this.dictionary.computeSentence({
                    sentence,
                    accessibleRole,
                    parameters: [ content, accessibleName ]
                });
            })[0];
    }
    private buildSentencesWithRoleAndName(accessibleRole: string, accessibleName: string, useValueAsMockData = true) {
        const sentenceKey = accessibleRole === "textbox" ? "key.when.type" : "key.when.enter";
        const wording = this.buildWording(sentenceKey, accessibleRole, accessibleName, useValueAsMockData);
        return [stepCase + wording];
    }

    /* eslint-disable  @typescript-eslint/no-explicit-any */
    private buildWording(computedKey: string, accessibleRole: string, accessibleName: string, useValueAsMockData = true) {
        const typeSentence = [
            ...this.dictionary.getRoleBasedSentencesTemplate(),
            ...this.dictionary.getBaseSentences()
        ].find(
            (el) => (el.key === computedKey)
        );
        return this.dictionary.computeSentence({
            mock: this.getMockedDataForAccessibleRole(accessibleRole, useValueAsMockData),
            sentence: typeSentence!,
            accessibleRole,
            parameters: [ accessibleName ]
        });
    }

    private getMockedDataForAccessibleRole(accessibleRole: string, useValueAsMockData = true): string {
        let content: string | undefined;
        if (useValueAsMockData) {
            const isInputHtmlOrTextArea = this.selectedHtmlElem instanceof HTMLInputElement || this.selectedHtmlElem instanceof HTMLTextAreaElement;
            content = isInputHtmlOrTextArea ?
                /* eslint-disable  @typescript-eslint/no-explicit-any */
                (this.selectedHtmlElem as any).value :
                this.selectedHtmlElem.getAttribute("value") ?? this.selectedHtmlElem.firstChild?.textContent?.trim();
            if (!content) {
                content = undefined;
            }
        }
        if (accessibleRole === "spinbutton") {
            return content ?? "123";
        }
        if (accessibleRole === "slider") {
            return content ?? "3";
        }
        return content ?? "Lorem ipsum";
    }

    private getMockedDataForHtmlElement(htmlElem: HTMLElement | SVGElement, content?: string): string {
        if (content) {
            content = "\"" + content + "\"";
        } else {
            content = undefined;
        }
        if (htmlElem.tagName.toLowerCase() === "input") {
            if (htmlElem.getAttribute("type") === "number") {
                return content ?? "\"123\"";
            }
            if (htmlElem.getAttribute("type") === "date") {
                return content ?? "\"30/07/2024\"";
            }
            if (htmlElem.getAttribute("type") === "time") {
                return content ?? "\"14:03\"";
            }
        }
        return content ?? "\"Lorem ipsum\"";
    }
}
