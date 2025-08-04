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
    const indefiniteArticle = "a";
    let roleName;
    let values;
    const sentenceKey = "key.then.element.withRoleAndNameAndContent";
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
        roleName = "table";
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
          roleName = "grid";
        break;
      }
      case "treegrid": {
        const treegridRowgroup =
          Array.from(selectedArray.children)
            .find(child => getRole(child) === "rowgroup");
        if (treegridRowgroup) {
          data = Array.from(treegridRowgroup.children)
            .filter(child => getRole(child) === "row");
          headers = data[0];
          roleName = "treegrid";
          values = Array.from(data).slice(1);
        }
        break;
      }
    }
    const result = this.expectTranslator.computeTableSentenceFromKeyNameAndContent(
      sentenceKey,
      indefiniteArticle,
      roleName,
      tableName,
      headers,
      values
    );
    sentences.push(result);
    return sentences;
  }
}
