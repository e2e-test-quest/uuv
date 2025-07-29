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
import { computeAccessibleName, getRole } from "dom-accessibility-api";
import { AbstractComponentService } from "./AbstractComponentService";

export class TableAndGridService extends AbstractComponentService {

  async buildResultSentence(
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
      case "table": {
        const tableRowgroup = Array.from(selectedArray.children)
          .filter(child => getRole(child) === "rowgroup");
        const rows = tableRowgroup
          .flatMap(value => Array.from(value.children))
          .filter(child => getRole(child) === "row");
        headers = rows[0];
        values = rows.slice(1);
        sentenceKey = "key.then.table.withNameAndContent";
        break;
      }
      case "grid": {
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
      }
      case "treegrid": {
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
      }
      default:
        sentenceKey = null;
    }

    const result = this.expectTranslator.computeTableSentenceFromKeyNameAndContent(
      sentenceKey,
      tableName,
      headers,
      values,
    );
    sentences.push(result);
    return sentences;
  }
}
