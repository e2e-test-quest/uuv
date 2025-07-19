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

import { FocusableElement, tabbable } from "tabbable";
import { AdditionalLayerEnum, ResultSentence } from "../Commons";
import * as LayerHelper from "./LayerHelper";
import { StepCaseEnum } from "../translator/model";
import { KeyboardNavigationTranslator } from "../translator/keyboard-navigation-translator";
import { Translator } from "../translator/abstract-translator";
import { HIGHLIGHT_ORANGE_PROPS } from "./highlight/HighlightHelper";

const translator: Translator = new KeyboardNavigationTranslator();

export interface KeyboardNavigation {
  current: FocusableElement[],
  expected: FocusableElement[]
}

export function switchKeyboardLayer(keyboardLayer: ShadowRoot, layer: AdditionalLayerEnum, elements: FocusableElement[]) {
  const htmlElements = elements.map(el => el as HTMLElement);
  if (layer === AdditionalLayerEnum.CURRENT_NAVIGATION) {
    LayerHelper.removeLayerToShadowDom(keyboardLayer, AdditionalLayerEnum.EXPECTED_NAVIGATION);
    LayerHelper.addLayerToShadowDom(keyboardLayer, AdditionalLayerEnum.CURRENT_NAVIGATION);
    LayerHelper.buildLayer(
        keyboardLayer,
        AdditionalLayerEnum.CURRENT_NAVIGATION,
        htmlElements,
        buildAdditionalStyle(htmlElements),
        false,
        true
    );
  } else {
    LayerHelper.removeLayerToShadowDom(keyboardLayer, AdditionalLayerEnum.CURRENT_NAVIGATION);
    LayerHelper.addLayerToShadowDom(keyboardLayer, AdditionalLayerEnum.EXPECTED_NAVIGATION);
    LayerHelper.buildLayer(keyboardLayer,
        AdditionalLayerEnum.EXPECTED_NAVIGATION,
        htmlElements,
        buildAdditionalStyle(htmlElements),
        false,
        true
    );
  }
}

export async function getKeyboardNavigation(): Promise<KeyboardNavigation> {
  const currentKeyboardFocusableElements = tabbable(document.body, {});
  return {
    current: currentKeyboardFocusableElements,
    expected: extractExpectedKeyboardNavigation(currentKeyboardFocusableElements)
  };
}

export async function buildResultSentence(
  focusableElements: FocusableElement[]
): Promise<ResultSentence[]> {
  const sentences: string[] = [];
  const startKeyboardNavigationSentence = translator.getSentenceFromKey("key.given.keyboard.startNavigationFromTheTop");
  if (startKeyboardNavigationSentence) {
    sentences.push(StepCaseEnum.AND + startKeyboardNavigationSentence.wording);
  }
  const promises = focusableElements.map(async (node) => {
    const focusBySelectorControlSentence = translator.getSentenceFromKey("key.then.element.withSelectorFocused");
    const focusByRoleAndNameControlSentence = translator.getSentenceFromKey( "key.then.element.withRoleAndNameFocused");

    if (focusBySelectorControlSentence && focusByRoleAndNameControlSentence) {
      const result = await translator.translate(node);
      result.sentences.forEach((element) => {
        sentences.push(element);
      });
    } else {
      console.error("sentences next focus element or check focused element is undefined");
    }
    return Promise.resolve("");
  });
  await Promise.all(promises);
  return sentences.map((elem, key) => {
    return {
      key: key as React.Key,
      result: elem
    } as ResultSentence;
  });
}

function buildAdditionalStyle(elements: HTMLElement[]) {
  let completeStyle = "";
  if (elements) {
    elements.forEach((element, index) => {
      completeStyle = `${completeStyle}
                
        #element-border-${index}:has(~ #order-${index}:hover), #element-border-${index}:has(~ #order-content-${index}:hover) {
          stroke-width: ${HIGHLIGHT_ORANGE_PROPS.width};
          stroke: ${HIGHLIGHT_ORANGE_PROPS.borderColor};
          fill: transparent;
        }
        
        .line:has(~ #order-${index}:hover), .navigation-line:has(~ #order-content-${index}:hover) {
          stroke: grey;
        }
        `;
    });
  }
  return completeStyle;
}
function extractExpectedKeyboardNavigation(currentKeyboardFocusableElements: FocusableElement[]) {
  return [...currentKeyboardFocusableElements].sort((a: FocusableElement, b: FocusableElement) => {
    const leftRect = a.getBoundingClientRect();
    const rightRect = b.getBoundingClientRect();
    if (leftRect.y < rightRect.y) {
      return -1;
    }
    if (leftRect.y === rightRect.y && leftRect.x < rightRect.x) {
      return -1;
    }
    return 1;
  });
}
