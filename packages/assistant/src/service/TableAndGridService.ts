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
    let headers;
    const indefiniteArticle = "a";
    let roleName;
    let values;
    let cellRoleName;
    const sentenceKey = "key.then.element.withRoleAndNameAndContent";
    const role: string = getRole(selectedArray) ?? "";
    switch (role) {
      case "table": {
        const headerAndDataRows = this.extractHeaderAndDataRows(selectedArray);
        headers = headerAndDataRows.headers;
        values = headerAndDataRows.values;
        roleName = "table";
        cellRoleName = "cell";
        break;
      }
      case "grid": {
        const headerAndDataRows = this.extractHeaderAndDataRows(selectedArray);
        headers = headerAndDataRows.headers;
        values = headerAndDataRows.values;
        roleName = "grid";
        cellRoleName = "gridcell";
        break;
      }
      case "treegrid": {
        const headerAndDataRows = this.extractHeaderAndDataRows(selectedArray);
        headers = headerAndDataRows.headers;
        values = headerAndDataRows.values;
        roleName = "treegrid";
        cellRoleName = "gridcell";
        break;
      }
    }
    const result = this.expectTranslator.computeTableSentenceFromKeyNameAndContent(
      sentenceKey,
      indefiniteArticle,
      roleName,
      tableName,
      headers,
      values,
      cellRoleName
    );
    sentences.push(result);
    return sentences;
  }

  private extractHeaderAndDataRows(selectedArray: HTMLTableElement | HTMLElement) {
    const rows = Array.from(selectedArray.querySelectorAll('[role=row], tr'));
    if (rows.length > 0) {
      return {
        headers: rows[0],
        values: rows.slice(1)
      };
    } else {
      return {
        headers: [],
        values: []
      }
    }
  }
}
