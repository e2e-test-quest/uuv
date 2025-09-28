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
import { BaseSentence, StepCaseEnum, TranslateSentences } from "./model";

const stepCase = StepCaseEnum.WHEN;

export class ClickTranslator extends Translator {
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
        return this.getSentenceFromAccessibleRoleAndName(accessibleRole, accessibleName);
    }

    override getSentenceFromDomSelector(htmlElem: HTMLElement | SVGElement): TranslateSentences {
        const response = this.initResponse();
        const computedKey = "key.when.withinElement.selector";
        const sentence = this.computeSentenceFromKeyAndSelector(computedKey, Translator.getSelector(htmlElem));
        const clickSentence: BaseSentence = this.getSentenceFromKey("key.when.click.withContext");
        response.sentences = [stepCase + sentence, StepCaseEnum.THEN + clickSentence.wording];
        return response;
    }

    private buildSentencesWithRoleAndName(accessibleRole: string, accessibleName: string) {
        const role = this.dictionary.getDefinedRoles().find(role => role.shouldGenerateClickSentence && role.id === accessibleRole);
        if (role) {
            const wording = this.buildWording("key.when.click", accessibleRole, accessibleName);
            return [stepCase + wording];
        } else {
            const clickSentence: BaseSentence = this.getSentenceFromKey("key.when.click.withRole");
            return [stepCase + clickSentence.wording.replace("{string}", `"${accessibleRole}"`).replace("{string}", `"${accessibleName}"`)];
        }
    }

    /* eslint-disable  @typescript-eslint/no-explicit-any */
    private buildWording(computedKey: string, accessibleRole: string, accessibleName: string) {
        const clickSentence = [
            ...this.dictionary.getRoleBasedSentencesTemplate(),
            ...this.dictionary.getBaseSentences()
        ].find(
            (el) => (el.key === computedKey)
        );
        return this.dictionary.computeSentence({
            sentence: clickSentence!,
            accessibleRole,
            parameters: [ accessibleName ]
        });
    }
}
