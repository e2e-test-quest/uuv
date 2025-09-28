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
import { EnrichedSentence, StepCaseEnum, TranslateSentences } from "./model";
import * as TextualTranslator from "./textual-translator";
import { InformativeNodesHelper } from "../helper/informative-nodes-helper";
import { computeAccessibleName } from "dom-accessibility-api";

const stepCase = StepCaseEnum.THEN;

export class ExpectTranslator extends Translator {
    private buildResponse(sentences: string[]): TranslateSentences {
        const response = this.initResponse();
        response.sentences = sentences.map(s => stepCase + s);
        return response;
    }

    override getSentenceFromAccessibleRoleAndName(role: string, name: string): TranslateSentences {
        const key = "key.then.element.withRoleAndName";
        const sentence = this.computeSentenceFromKeyRoleAndName(key, role, name);
        return this.buildResponse([sentence]);
    }

    override getSentenceFromAccessibleRoleAndNameAndContent(role: string, name: string, content: string): TranslateSentences {
        const isDisabled = this.selectedHtmlElem.classList.contains(UUV_DISABLED_CLASS);
        const key = isDisabled ? "key.then.element.withRoleAndNameAndContentDisabled" : "key.then.element.withRoleAndNameAndContent";
        const sentence = this.computeSentenceFromKeyRoleNameAndContent(key, role, name, content);
        return this.buildResponse([sentence]);
    }

    override getSentenceFromDomSelector(htmlElem: HTMLElement | SVGElement): TranslateSentences {
        const key = "key.then.element.withSelector";
        const sentence = this.computeSentenceFromKeyAndSelector(key, Translator.getSelector(htmlElem));
        return this.buildResponse([sentence]);
    }

    public computeTableSentenceFromKeyNameAndContent(sentenceKey: string, indefiniteArticle: string, roleName: string, accessibleName: string, headers: HTMLElement, rows: HTMLElement[], cellRoleName: string): string {
        if (!sentenceKey) {
            return "";
        }

        const baseSentence = this.jsonEnriched.enriched.find((v: EnrichedSentence) => v.key === sentenceKey);
        const sentenceAvailable = `Then ${baseSentence?.wording ?? ""}`
            .replace("$indefiniteArticle", `${indefiniteArticle}`)
            .replace("$roleName", `${roleName}`)
            .replace("{string}", `"${accessibleName}"`)
            .replace("{string}", "");

        const headerValues = Array.from(headers.querySelectorAll('[role=columnheader], th')).map(c => computeAccessibleName(c));
        const tableLines: string[] = ["| " + headerValues.join(" | ") + " |", "| " + headerValues.map(() => "---").join(" | ") + " |"];

        rows.forEach(row => {
            const values = Array.from(row.querySelectorAll(`[role=${cellRoleName}], td, [role=columnheader], th`)).map(c => {
                if(c.classList.contains("ag-floating-filter")) {
                    return Array.from(c.querySelectorAll('[role=button]:not(.ag-hidden [role=button]), button:not(.ag-hidden button)')).reduce(
                        (accumulator, button) => accumulator + (accumulator.length > 0 ? " " : "") + computeAccessibleName(button),
                        ""
                    );
                }
                return computeAccessibleName(c);
            });
            tableLines.push("| " + values.join(" | ") + " |");
        });

        return sentenceAvailable + "\n" + this.formatMarkdownTable(tableLines).join("\n");
    }

    public async computeDialogSentenceFromKeyNameAndContent(sentenceKey: string, accessibleName: string, row: HTMLElement): Promise<string[]> {
        const sentences: string[] = [`Then ${this.computeSentenceFromKeyRoleAndName(sentenceKey, "dialog", accessibleName)}`];

        const getSentencesForNode = async (node: HTMLElement): Promise<string[]> => {
            if (TextualTranslator.isTextualNode(node)) {
                const res = await TextualTranslator.computeSentence(node);
                return res?.sentences ?? [];
            }
            const res = await this.translate(node);
            return res?.sentences ?? [];
        };

        const handleElement = async (element: HTMLElement) => {
            if (element.children.length === 1) {
                const informativeChildren = await new InformativeNodesHelper().getAvailableChildren(element);
                for (const child of informativeChildren) {
                    sentences.push(...(await getSentencesForNode(child as HTMLElement)));
                }
            } else {
                sentences.push(...(await getSentencesForNode(element)));
            }
        };

        await Promise.all(Array.from(row.children).map(el => handleElement(el as HTMLElement)));
        return sentences;
    }

    private formatMarkdownTable(lines: string[]): string[] {
        const headerLine = lines.find(line => !/^ *\|? *-+/.test(line))!;
        const separatorLine = lines.find(line => /^ *\|? *-+/.test(line))!;
        const dataLines = lines.filter(line => line !== headerLine && line !== separatorLine && line.trim());

        const parse = (line: string) =>
            line
                .replace(/^\||\|$/g, "")
                .split("|")
                .map(cell => cell.trim());

        const header = parse(headerLine);
        const rows = dataLines.map(parse);
        const colCount = Math.max(header.length, ...rows.map(r => r.length));
        const colWidths = Array(colCount).fill(0);

        [header, ...rows].forEach(r => r.forEach((cell, i) => (colWidths[i] = Math.max(colWidths[i], cell.length))));

        const FORMAT_PREFFIX = "      ";
        const formatRow = (row: string[]) => FORMAT_PREFFIX + "| " + row.map((cell, i) => cell.padEnd(colWidths[i])).join(" | ") + " |";

        const separator = FORMAT_PREFFIX + "| " + colWidths.map(w => "-".repeat(w)).join(" | ") + " |";
        return [formatRow(header), separator, ...rows.map(formatRow)];
    }
}
