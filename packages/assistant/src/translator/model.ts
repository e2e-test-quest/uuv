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

export class Suggestion {
    constructor(
        public accessibleAttribute: string = "",
        public accessibleValue = "",
        public code = "",
        public sentenceAfterCorrection: string[] = []
    ) {}
}

export type BaseSentence = {
    key: string;
    description: string;
    wording: string;
}

export type EnrichedSentence = {
    key: string;
    wording: string;
}

export enum StepCaseEnum {
    WHEN = "When ",
    THEN = "Then ",
    GIVEN = "Given ",
    AND = "And "
}

export type TranslateSentences = {
    suggestion: Suggestion | undefined,
    sentences: string[]
}
