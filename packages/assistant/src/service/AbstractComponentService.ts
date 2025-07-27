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

import * as LayerHelper from "../helper/LayerHelper";
import { HIGHLIGHT_ORANGE_PROPS } from "../helper/highlight/HighlightHelper";
import { AdditionalLayerEnum } from "../Commons";
import { ExpectTranslator } from "../translator/expect-translator";

export abstract class AbstractComponentService {
  expectTranslator: ExpectTranslator = new ExpectTranslator();

  private buildAdditionalStyle(elements: Element[]) {
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
  addListener(
    dom: ShadowRoot,
    elements: HTMLElement[],
    onSelect: (el: HTMLElement) => void,
    onReset: () => void,
  ) {
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

  show(
    dom: ShadowRoot,
    layer: AdditionalLayerEnum,
    htmlElements: HTMLElement[],
    onSelect: (el: HTMLElement) => void,
    onReset: () => void,
  ) {
    const customLayer = document.createElement("div");
    customLayer.setAttribute("id", layer.toString());
    customLayer.setAttribute("class", "uvv-assistant-additional-layer");
    dom.appendChild(customLayer);
    LayerHelper.buildLayer(
      dom,
      layer,
      htmlElements,
      this.buildAdditionalStyle(htmlElements),
      true,
      false,
    );
    this.addListener(dom, htmlElements, onSelect, onReset);
  }

  abstract async buildResultSentence(
    selectedArray: HTMLElement,
  ): Promise<string[]>;
}
