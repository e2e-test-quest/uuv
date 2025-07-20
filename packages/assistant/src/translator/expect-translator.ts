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

import { UUV_DISABLED_CLASS } from "../Commons";
import { Translator } from "./abstract-translator";
import { StepCaseEnum, TranslateSentences } from "./model";

const stepCase = StepCaseEnum.THEN;

export class ExpectTranslator extends Translator {
    override getSentenceFromAccessibleRoleAndName(accessibleRole: string, accessibleName: string): TranslateSentences {
        const response = this.initResponse();
        const computedKey = "key.then.element.withRoleAndName";
        const sentence = this.computeSentenceFromKeyRoleAndName(computedKey, accessibleRole, accessibleName);
        response.sentences = [stepCase + sentence];
        return response;
    }

    override getSentenceFromAccessibleRoleAndNameAndContent(
        accessibleRole: string,
        accessibleName: string,
        content: string
    ): TranslateSentences {
        const response = this.initResponse();
        const isDisabled = this.selectedHtmlElem.classList.contains(UUV_DISABLED_CLASS);
        const computedKey = isDisabled ?
            "key.then.element.withRoleAndNameAndContentDisabled" :
            "key.then.element.withRoleAndNameAndContent";
        const sentence = this.computeSentenceFromKeyRoleNameAndContent(computedKey, accessibleRole, accessibleName, content);
        response.sentences = [stepCase + sentence];
        return response;
    }

    override getSentenceFromDomSelector(htmlElem: HTMLElement | SVGElement): TranslateSentences {
        const response = this.initResponse();
        const computedKey = "key.then.element.withSelector";
        const sentence = this.computeSentenceFromKeyAndSelector(computedKey, Translator.getSelector(htmlElem));
        response.sentences = [stepCase + sentence];
        return response;
    }
}
