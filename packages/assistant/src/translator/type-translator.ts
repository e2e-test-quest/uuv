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
import { BaseSentence, EnrichedSentence, EnrichedSentenceRole, StepCaseEnum, TranslateSentences } from "./model";
import { EN_ROLES } from "@uuv/runner-commons/wording/web/en";

const stepCase = StepCaseEnum.WHEN;

export class TypeTranslator extends Translator {
    override getSentenceFromAccessibleRoleAndName(accessibleRole: string, accessibleName: string): TranslateSentences {
        const response = this.initResponse();
        response.sentences = this.buildSentencesWithRoleAndName(accessibleRole, accessibleName);
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

    override getSentenceFromDomSelector(htmlElem: HTMLElement | SVGElement): TranslateSentences {
        const response = this.initResponse();
        const computedKey = "key.when.withinElement.selector";
        const sentence = this.computeSentenceFromKeyAndSelector(computedKey, this.getSelector(htmlElem));
        const clickSentence: BaseSentence = this.getSentenceFromKey("key.when.type.withContext");
        const resetContextSentence: BaseSentence = this.getSentenceFromKey("key.when.resetContext");
        const content = htmlElem instanceof HTMLInputElement || htmlElem instanceof HTMLTextAreaElement ? htmlElem.value : htmlElem.getAttribute("value") ?? htmlElem.firstChild?.textContent?.trim();
        response.sentences = [
            stepCase + sentence,
            StepCaseEnum.AND + clickSentence.wording.replace("{string}", this.getMockedDataForHtmlElement(htmlElem, content)),
            StepCaseEnum.AND + resetContextSentence.wording
        ];
        return response;
    }

    override computeSentenceFromKeyRoleNameAndContent(computedKey: string, accessibleRole: string, accessibleName: string, content: string) {
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
                    .replace("{string}", `"${content}"`)
                    .replace("{string}", `"${accessibleName}"`);
            })[0];
    }
    private buildSentencesWithRoleAndName(accessibleRole: string, accessibleName: string) {
        const role = EN_ROLES.find(role => role.shouldGenerateTypeSentence && role.id === accessibleRole);
        if (role) {
            const sentenceKey = accessibleRole === "textbox" ? "key.when.type" : "key.when.enter";
            const wording = this.buildWording(sentenceKey, accessibleRole, accessibleName, role);
            return [stepCase + wording];
        }
        return [];
    }

    /* eslint-disable  @typescript-eslint/no-explicit-any */
    private buildWording(computedKey: string, accessibleRole: string, accessibleName: string, role: any) {
        const clickSentence = [
            ...this.jsonEnriched.enriched,
            ...this.jsonBase
        ].find(
            (el) => (el.key === computedKey)
        );
        return clickSentence?.wording
            .replace("{string}", this.getMockedDataForAccessibleRole(accessibleRole))
            .replaceAll("$roleName", role?.name ?? accessibleRole)
            .replaceAll("$definiteArticle", role?.getDefiniteArticle())
            .replaceAll("$indefiniteArticle", role?.getIndefiniteArticle())
            .replaceAll("$namedAdjective", role?.namedAdjective())
            .replaceAll("$ofDefiniteArticle", role?.getOfDefiniteArticle())
            .replace("{string}", `"${accessibleName}"`);
    }

    private getMockedDataForAccessibleRole(accessibleRole: string): string {
        let content = this.selectedHtmlElem instanceof HTMLInputElement || this.selectedHtmlElem instanceof HTMLTextAreaElement ? this.selectedHtmlElem.value : this.selectedHtmlElem.getAttribute("value") ?? this.selectedHtmlElem.firstChild?.textContent?.trim();
        if (content) {
            content = "\"" + content + "\"";
        } else {
            content = undefined;
        }
        if (accessibleRole === "spinbutton") {
            return content ?? "\"123\"";
        }
        if (accessibleRole === "slider") {
            return content ?? "\"3\"";
        }
        return content ?? "\"Lorem ipsum\"";
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
