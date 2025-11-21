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

import fs from "fs";
import { Common } from "./common";
import * as path from "path";
import { AccessibleRole, BaseSentence, Dictionary, getDefinedDictionary, LANG } from "@uuv/dictionary";
import _ from "lodash";

export class AutocompletionSuggestion {
    suggestion !: string;
    link !: string;
}

export function runGenerateDoc(destDir: string) {
    const GENERATED_DIR_DOC = `${destDir}/docs/04-wordings/01-generated-wording-description`;
    const GENERATED_DIR_DOC_FR = `${destDir}/i18n/fr/docusaurus-plugin-content-docs/current/04-wordings/01-generated-wording-description`;

    Object.values(LANG).forEach((lang: string, index: number) => {
        const indexOfFile = (index + 1).toLocaleString("fr-FR", {
            minimumIntegerDigits: 2,
            useGrouping: false,
        });
        const generatedFile = `${GENERATED_DIR_DOC}/${indexOfFile}-${lang}-generated-wording-description.md`;
        const dictionary = getDefinedDictionary(lang);
        const autocompletionSuggestionFile = path.join(GENERATED_DIR_DOC, `${lang}-autocompletion-suggestion.json`);
        cleanGeneratedFilesIfExists(generatedFile, lang, indexOfFile);
        Common.cleanGeneratedFilesIfExists(autocompletionSuggestionFile);
        generateWordingFiles(dictionary, generatedFile, lang, indexOfFile, autocompletionSuggestionFile);
        fs.copyFileSync(generatedFile, `${GENERATED_DIR_DOC_FR}/${indexOfFile}-${lang}-generated-wording-description.md`);
        fs.copyFileSync(autocompletionSuggestionFile, path.join(GENERATED_DIR_DOC_FR, `${lang}-autocompletion-suggestion.json`));
    });

    function cleanGeneratedFilesIfExists(
            generatedFile: string,
            lang: string,
            indexOfFile: string
    ): void {
            if (fs.existsSync(generatedFile)) {
            fs.rmSync(generatedFile);
            console.log(
                `[DEL] ${indexOfFile}-${lang}-generated-wording-description.md deleted successfully`
            );
        }
    }


    function generateWordingFiles(
        dictionary: Dictionary,
        generatedFile: string,
        lang: string,
        indexOfFile: string,
        autocompletionSuggestionFile: string
    ): void {
         const { wordingFileContent, autocompletionSuggestionContent } = computeWordingFile(
             dictionary,
             lang
         );
        writeWordingFile(generatedFile, wordingFileContent, lang, indexOfFile);
        Common.writeWordingFile(autocompletionSuggestionFile, autocompletionSuggestionContent);
    }

    function computeWordingFile(dictionary: Dictionary, lang: string): {
        wordingFileContent: string,
        autocompletionSuggestionContent: string
    } {
        const wordingEnrichedNormalizedOrigin = normalizedForMdx(dictionary.getRoleBasedSentencesTemplate());
        const wordingsBaseNormalized = normalizedForMdx(dictionary.getBaseSentences());
        const title = (function () {
            switch (lang) {
                case LANG.FR.toString():
                    return (
                        "# Français \n" +
                        ":::caution\n" +
                        "Pensez bien à rajouter `#language: fr` en entête de votre fichier feature.\n" +
                        ":::\n\n");
                default:
                    return "# English";
            }
        })();
        const autocompletionComponent = `\nimport {UuvWordingAutocomplete} from '@site/src/components/WordingAutocomplete/uuv-wording-autocomplete.js';\n\n<UuvWordingAutocomplete lang={'${lang}'}/>\n`;
        const rows = [title, autocompletionComponent];
        const autocompletionSuggestions: AutocompletionSuggestion[] = [];

        const stepTitle: string[] = (function () {
            switch (lang) {
                case LANG.FR.toString():
                    return ["## Etant donné que", "## Quand", "## Alors"];
                case LANG.EN.toString():
                    return ["## Given", "## When", "## Then"];
                default:
                    return ["", "", ""];
            }
        })();
        const { step: given, autocompletionSuggestions: givenAutocompletionSuggestions } = computeStepDefinition(
            wordingsBaseNormalized,
            "key.given",
            stepTitle[0],
            undefined
        );
        const { step: when, autocompletionSuggestions: whenAutocompletionSuggestions } = computeStepDefinition(
            wordingsBaseNormalized,
            "key.when",
            stepTitle[1],
            undefined
        );
        const { step: then, autocompletionSuggestions: thenAutocompletionSuggestions } = computeStepDefinition(
            wordingsBaseNormalized,
            "key.then",
            stepTitle[2],
            undefined
        );
        rows.push(...given, ...when, ...then);
        autocompletionSuggestions.push(...givenAutocompletionSuggestions, ...whenAutocompletionSuggestions, ...thenAutocompletionSuggestions);
        rows.push("## Par rôle");
        // console.debug("roles", wordingsEnrichedJson.role)
        const definedRoles = dictionary.getDefinedRoles();
        definedRoles.forEach((role) => {
            rows.push(`### ${role.id}`);
            const wordingEnrichedNormalized = _.cloneDeep(wordingEnrichedNormalizedOrigin);
            wordingEnrichedNormalized.forEach(sentence => {
                sentence.wording = sentence.wording.replaceAll("$roleName", role.name)
                                                    .replaceAll("$roleId", role.id)
                                                    .replaceAll("$definiteArticle", role.getDefiniteArticle())
                                                    .replaceAll("$indefiniteArticle", role.getIndefiniteArticle())
                                                    .replaceAll("$namedAdjective", role.namedAdjective())
                                                    .replaceAll("$ofDefiniteArticle", role.getOfDefiniteArticle());
            });
            const { step: enrichedGiven, autocompletionSuggestions: enrichedGivenAutocompletionSuggestions } = computeStepDefinition(
                wordingEnrichedNormalized,
                "key.given",
                undefined,
                "####",
                role
            );
            if (enrichedGiven.length > 1) {
                rows.push(...enrichedGiven);
                autocompletionSuggestions.push(...enrichedGivenAutocompletionSuggestions);
            }
            const { step: enrichedWhen, autocompletionSuggestions: enrichedWhenAutocompletionSuggestions } = computeStepDefinition(
                wordingEnrichedNormalized,
                "key.when",
                undefined,
                "####",
                role
            );
            if (enrichedWhen.length > 1) {
                rows.push(...enrichedWhen);
                autocompletionSuggestions.push(...enrichedWhenAutocompletionSuggestions);
            }
            const { step: enrichedThen, autocompletionSuggestions: enrichedThenAutocompletionSuggestions } = computeStepDefinition(
                wordingEnrichedNormalized,
                "key.then",
                undefined,
                "####",
                role
            );
            if (enrichedThen.length > 1) {
                rows.push(...enrichedThen);
                autocompletionSuggestions.push(...enrichedThenAutocompletionSuggestions);
            }
        });


        return {
            wordingFileContent: rows.join("\n"),
            autocompletionSuggestionContent: JSON.stringify(autocompletionSuggestions)
        };
    }

    /* eslint-disable  @typescript-eslint/no-explicit-any */
    function computeStepDefinition(
        wordingsJson: any,
        stepKey: string,
        stepTitle: string | undefined,
        level: string | undefined = "###",
        role?: AccessibleRole
    ):{
        step: string[],
        autocompletionSuggestions: AutocompletionSuggestion[]
    } {
        const step: string[] = [];
        const autocompletionSuggestion: AutocompletionSuggestion[] = [];
        if (stepTitle) {
            step.push(stepTitle);
        }
        wordingsJson.forEach((conf) => {
            if (conf.key.startsWith(stepKey) && shouldGenerate(conf, role)) {
                const wording = `${level} ${conf.wording}`;
                step.push(wording);

                conf.description?.split("\\n").forEach((descriptionLine, index, array) => {
                    if (index === 0) {
                        step.push(`> ${descriptionLine ?? ""}`);
                    } else if (index === array.length - 1) {
                        step.push(` ${descriptionLine ?? ""}\n`);
                    } else {
                        step.push(` ${descriptionLine ?? ""}`);
                    }
                });

                autocompletionSuggestion.push({
                    suggestion: conf.wording
                     .replaceAll("\\", ""),
                    link: conf.wording
                        .replaceAll("{", "")
                        .replaceAll("}", "")
                        .replaceAll("(", "")
                        .replaceAll(")", "")
                        .replaceAll("'", "")
                        .replaceAll("\\", "")
                        .replaceAll(/\s/g, "-").toLowerCase()
                });
            }
        });
        return {
            step,
            autocompletionSuggestions: autocompletionSuggestion
        };
    }

    function shouldGenerate(wordingsConf: any, role?: AccessibleRole) {
        if (role === undefined) {
            return true;
        }
        switch (wordingsConf.section) {
            case "contains" :
                return role.shouldGenerateContainsSentence;
            case "click" :
                return role.shouldGenerateClickSentence;
            case "type" :
                return role.shouldGenerateTypeSentence;
            case "keyboard" :
                return role.shouldGenerateKeyboardSentence;
            case "checkable" :
                return role.shouldGenerateCheckedSentence;
            default :
                return true;
        }
    }

    function writeWordingFile(generatedFile, data, lang, indexOfFile) {
        fs.writeFileSync(generatedFile, data);
        console.log(
            `[WRITE] ${indexOfFile}-${lang}-generated-wording-description.md written successfully`
        );
    }

    function normalizedForMdx(data: BaseSentence[]) {
        data.forEach(sentence => {
            sentence.wording = normalizeFieldForMdx(sentence.wording);
            sentence.description =  normalizeFieldForMdx(sentence.description);
        });
        return data;
    }

    function normalizeFieldForMdx(field: string) {
        return field
            .replaceAll("{string}", "\\{string\\}")
            .replaceAll("{}", "\\{\\}")
            .replaceAll("{int}", "\\{int\\}")
            .replaceAll("{key}", "\\{key\\}")
            .replaceAll("{reverseTab}", "\\{reverseTab\\}")
            .replaceAll("{tab}", "\\{tab\\}")
            .replaceAll("{down}", "\\{down\\}")
            .replaceAll("{right}", "\\{right\\}")
            .replaceAll("{left}", "\\{left\\}")
            .replaceAll("{up}", "\\{up\\}");
    }
}
