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

import { AdditionalLayerEnum } from "../Commons";
import * as LayerHelper from "./LayerHelper";
import { HIGHLIGHT_ORANGE_PROPS } from "./highlight/HighlightHelper";
import { computeAccessibleName, getRole } from "dom-accessibility-api";
import { ExpectTranslator } from "../translator/expect-translator";

const expectTranslator: ExpectTranslator = new ExpectTranslator();

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

function addListener(
  dom: ShadowRoot,
  elements: HTMLFormElement[],
  onSelect: (el: HTMLFormElement) => void,
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

export function show(
  dom: ShadowRoot,
  layer: AdditionalLayerEnum,
  elements: HTMLFormElement[],
  onSelect: (el: HTMLFormElement) => void,
  onReset: () => void,
) {
  const htmlElements = elements.map((el) => el as HTMLElement);
  const formCompletionLayer = document.createElement("div");
  formCompletionLayer.setAttribute("id", layer.toString());
  formCompletionLayer.setAttribute("class", "uvv-assistant-additional-layer");
  dom.appendChild(formCompletionLayer);
  LayerHelper.buildLayer(
    dom,
    AdditionalLayerEnum.ARRAY_COMPLETION,
    htmlElements,
    buildAdditionalStyle(htmlElements),
    true,
    false,
  );
  addListener(dom, elements, onSelect, onReset);
}

export async function buildResultSentence(
  selectedArray: HTMLTableElement | HTMLElement,
): Promise<string[]> {
  const sentences: string[] = [];
  const tableName = computeAccessibleName(selectedArray);
  let head: Element;
  let body: Element;
  let data: any[];
  let headers;
  let values;
  let sentenceKey: string | null;
  const role: string = getRole(selectedArray) ?? "";
  switch (role) {
    case "table":
      const tableRowgroup = Array.from(selectedArray.children)
      .filter(child => getRole(child) === "rowgroup");
      const rows = tableRowgroup
        .flatMap(value => Array.from(value.children))
        .filter(child => getRole(child) === "row");
      headers = rows[0];
      values = rows.slice(1);
      sentenceKey = "key.then.table.withNameAndContent";
      break;
    case "grid":
      const rowgroups =
        Array.from(selectedArray.children)
          .filter(child => getRole(child) === "rowgroup");
      head = rowgroups[0];
      body = rowgroups[1];
      headers = Array.from(head.children)
        .filter(child => getRole(child) === "row")[0];
      values = [].slice.call(Array.from(body.children).filter(child => getRole(child) === "row"));
      sentenceKey = "key.then.grid.withNameAndContent";
      break;
    case "treegrid":
      const treegridRowgroup =
        Array.from(selectedArray.children)
          .find(child => getRole(child) === "rowgroup");
      if (treegridRowgroup) {
        sentenceKey = "key.then.treegrid.withNameAndContent";
        data = Array.from(treegridRowgroup.children)
          .filter(child => getRole(child) === "row");
        headers = data[0];
        values = Array.from(data).slice(1);
      } else {
        sentenceKey = null;
      }
      break;
    default:
      sentenceKey = null;
  }

  const result = expectTranslator.computeTableSentenceFromKeyNameAndContent(
    sentenceKey,
    tableName,
    headers,
    values,
  );
  sentences.push(result);
  return sentences;
}
