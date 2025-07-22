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
import { EnrichedSentence, EnrichedSentenceRole, StepCaseEnum, TranslateSentences } from "./model";
import { EN_ROLES } from "@uuv/runner-commons/wording/web/en";

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

  public computeTableSentenceFromKeyNameAndContent(sentenceKey: string, accessibleName: string, headers: HTMLElement, rows: any[]): string {
      if (!sentenceKey) {return ""}
    const formattedRows: string[] = [];
    const baseSentence = this.jsonBase
      .filter((value: EnrichedSentence) => value.key === sentenceKey)[0];
    const sentenceAvailable = `Then ${baseSentence.wording}`;
    const headerCells = Array.from(headers.children) as HTMLElement[];
    const headerValues = headerCells.map(cell => cell.textContent?.trim() ?? "");
    formattedRows.push("| " + headerValues.join(" | ") + " |");
    formattedRows.push( "| " + headerValues.map(() => "---").join(" | ") + " |");
    rows.map(row => {
      const cells = Array.from(row.children) as HTMLElement[];
      const values = cells.map(cell => cell.textContent?.trim() ?? "");

      formattedRows.push("| " + values.join(" | ") + " |");
    });
  return sentenceAvailable
          .replace("{string}", `"${accessibleName}"`)
          .concat("\n")
          .concat(...this.formatMarkdownTable(formattedRows).join("\n"));
  }

  private formatMarkdownTable(lines: string[]): string[] {
    const headerLine = lines.find(line => !/^ *\|? *-+/.test(line))!;
    const separatorLine = lines.find(line => /^ *\|? *-+/.test(line))!;
    const dataLines = lines.filter(
      line => line !== headerLine && line !== separatorLine && line.trim()
    );

    const parseLine = (line: string) =>
      line
        .trim()
        .replace(/^\|/, "")
        .replace(/\|$/, "")
        .split("|")
        .map(cell => cell.trim());

    const header = parseLine(headerLine);
    const rows = dataLines.map(parseLine);

    const colCount = Math.max(header.length, ...rows.map(r => r.length));
    const colWidths = Array(colCount).fill(0);

    [header, ...rows].forEach(row => {
      row.forEach((cell, i) => {
        colWidths[i] = Math.max(colWidths[i], cell.length);
      });
    });

    const formatRow = (row: string[]) =>
      "      | " +
      row
        .map((cell, i) => cell.padEnd(colWidths[i]))
        .join(" | ") +
      " |";

    const formatSeparator = () =>
      "      | " +
      colWidths.map(w => "-".repeat(w)).join(" | ") +
      " |";

    return [
      formatRow(header),
      formatSeparator(),
      ...rows.map(formatRow)
    ];
  }
}
