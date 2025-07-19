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

import { FocusableElement } from "tabbable";
import { AdditionalLayerEnum } from "../Commons";
import * as LayerHelper from "./LayerHelper";
import { HIGHLIGHT_ORANGE_PROPS } from "./HighlightHelper";
import { Translator } from "../translator/abstract-translator";
import { TypeTranslator } from "../translator/type-translator";
import { ClickTranslator } from "../translator/click-translator";
import { getRole } from "dom-accessibility-api";

const typeTranslator: Translator = new TypeTranslator();
const clickTranslator: Translator = new ClickTranslator();

function buildAdditionalStyle(elements: HTMLElement[]) {
  let completeStyle = "";
  if (elements) {
    elements.forEach((element, index) => {
      completeStyle = `${completeStyle}
      
      .element-border {
        stroke-width: ${HIGHLIGHT_ORANGE_PROPS.width};
        stroke: ${HIGHLIGHT_ORANGE_PROPS.borderColor};
        fill-opacity: 10%;
        fill: black;
        cursor: pointer;
      }
      
      .element-border:hover {
        fill: red;
      }
      `;
    });
  }
  return completeStyle;
}

function addListener(dom: ShadowRoot, elements: HTMLFormElement[], onSelect: (el: HTMLFormElement) => void, onReset: () => void) {
  if (elements) {
    elements.forEach((element, index) => {
      const targetElement = dom.getElementById(`element-border-${index}`);
      if (targetElement) {
        const functionToTrigger = () => {
          onSelect(element);
        };
        targetElement.addEventListener("click", functionToTrigger);
      }
    });
    const escapeFunction = () => {
      onReset();
      document.removeEventListener("keydown", escapeFunction);
    };
    document.addEventListener("keydown", escapeFunction);
  }
}

export function show(
  dom: ShadowRoot,
  layer: AdditionalLayerEnum,
  elements: HTMLFormElement[],
  onSelect: (el: HTMLFormElement) => void,
  onReset: () => void
) {
  const htmlElements = elements.map(el => el as HTMLElement);
  const formCompletionLayer = document.createElement("div");
  formCompletionLayer.setAttribute("id", layer.toString());
  formCompletionLayer.setAttribute("class", "uvv-assistant-additional-layer");
  dom.appendChild(formCompletionLayer);
  LayerHelper.buildLayer(
      dom,
      AdditionalLayerEnum.FORM_COMPLETION,
      htmlElements,
      buildAdditionalStyle(htmlElements),
      true,
      false
  );
  addListener(dom, elements, onSelect, onReset);
}

export async function buildResultSentence(
  selectedForm: HTMLFormElement
): Promise<string[]> {
  const formElementForCompletion: FocusableElement[] = [].slice.call(selectedForm.getElementsByTagName("input"));
  formElementForCompletion.push(...[].slice.call(selectedForm.getElementsByTagName("button")));
  const sentences: string[] = [];
  let foundSubmitButton = false;
  const promises = formElementForCompletion
    .filter(element => !isDisabled(element) && !isHidden(element))
    .map(async formElement => {
      if (!isButton(formElement) || (isSubmitButton(formElement) && !foundSubmitButton)) {
        let translator = typeTranslator;
        if (isSubmitButton(formElement)) {
          translator = clickTranslator;
          foundSubmitButton = true;
        }
        const result = await translator.translate(formElement);
        sentences.push(...result.sentences);
      }
      return Promise.resolve("");
    });
  await Promise.all(promises);
  return sentences;
}

function isButton(element: FocusableElement): boolean {
  return getRole(element) === "button";
}

function isSubmitButton(element: FocusableElement): boolean {
  return isButton(element) && element.getAttribute("type") === "submit";
}

function isDisabled(element: FocusableElement): boolean {
  return (element as HTMLInputElement).disabled;
}
function isHidden(element: FocusableElement): boolean {
  return (element as HTMLInputElement).type === "hidden";
}
