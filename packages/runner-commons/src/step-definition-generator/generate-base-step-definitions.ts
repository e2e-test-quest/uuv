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
import { Common, fs, GenerateFileProcessing } from "./common";
import * as path from "path";
import { Dictionary, getDefinedDictionary, LANG } from "@uuv/dictionary";

export class BaseStepDefinition extends GenerateFileProcessing {
    override runGenerate() {
        Object.values(LANG).forEach((lang: string) => {
            const generatedFile = path.join(this.generatedDir, `_${lang}-generated-cucumber-steps-definition.ts`);
            Common.buildDirIfNotExists(this.generatedDir);
            Common.cleanGeneratedFilesIfExists(generatedFile);
            this.generateWordingFiles(generatedFile, lang);
        });
    }

    override generateWordingFiles(
        generatedFile: string,
        lang: string
    ): void {
        const data = fs.readFileSync(
            this.stepDefinitionFile,
            { encoding: "utf8" }
        );
        const dictionary = getDefinedDictionary(lang);
        const updatedData = this.computeWordingFile(data, dictionary);
        Common.writeWordingFile(generatedFile, updatedData);
    }

    override computeWordingFile(data: string, dictionary: Dictionary): string {
        data =
            "/*******************************\n" +
            "NE PAS MODIFIER, FICHIER GENERE\n" +
            "*******************************/\n\n" +
            data;
        data = data
            .replace("./_.common", "../_.common")
            .replace("../_constant", "../../_constant")
            .replace("./_context", "../_context")
            .replace("../../../cypress/commands", "../../../../cypress/commands")
            .replace("../../../playwright/chromium", "../../../../playwright/chromium")
            .replace("../i18n/template.json", "../../i18n/template.json")
            .replace("import {key} from \"@uuv/dictionary\";", "")
            .replace("import { key } from \"@uuv/dictionary\";", "")
            .replace("./core-engine", "../core-engine")
            .replace("../../preprocessor/run/world", "../../../preprocessor/run/world")
            .replace("./a11y-engine", "../a11y-engine")
            .replace("./_.common", "/../_.common");
        dictionary.getBaseSentences().forEach((sentence) => {
            data = data.replace("${" + sentence.key + "}", sentence.wording);
            data = data.replace(sentence.key + ".description", sentence.description);
        });
        return data;
    }
}
