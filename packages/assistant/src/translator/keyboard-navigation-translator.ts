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

const stepCase = StepCaseEnum.THEN;

export class KeyboardNavigationTranslator extends Translator {
    override getSentenceFromAccessibleRoleAndName(accessibleRole: string, accessibleName: string): TranslateSentences {
        const response = this.initResponse();
        const computedKey = "key.then.element.nextWithRoleAndNameFocused";
        const sentence = this.computeSentenceFromKeyRoleAndName(computedKey, accessibleRole, accessibleName);
        response.sentences = [stepCase + sentence];
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
        const computedKey = "key.then.element.withSelectorFocused";
        const sentence = this.computeSentenceFromKeyAndSelector(computedKey, Translator.getSelector(htmlElem));
        const nextFocusedElementSentence = this.dictionary.getBaseSentences().find((el: BaseSentence) => el.key === "key.when.keyboard.nextElement");
        response.sentences = [
            stepCase + nextFocusedElementSentence?.wording,
            StepCaseEnum.AND + sentence
        ];
        return response;
    }

}
