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


export async function computeSentence(element: HTMLElement | SVGElement | Element): Promise<TranslateSentences | null> {
  if (!isTextualNode(element)) {
      return null;
  }
  const sentenceKey = "key.then.element.withContent";
  const sentence = getData(element);
  const response: TranslateSentences = {
      suggestion: undefined,
      sentences: []
  };
    response.sentences = [stepCase + new ExpectTranslator().computeSentenceFromKeyAndContent(sentenceKey, sentence)];
    return Promise.resolve(response);
}

export function isTextualNode(element: HTMLElement | SVGElement | Element): boolean {
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

function getData(element: HTMLElement | SVGElement | Element): string {
    return element?.childNodes[0].textContent ?? "";
}
