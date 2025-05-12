import fs from "fs";
import path from "path";
import chalk from "chalk";

export class Translator {

  static readTranslationFile(projectDir: string, translationFile?: string): any {
    console.debug("  -> readTranslationFile: ");
    if (!translationFile) {
      return {};
    }
    try {
      const translations = JSON.parse(
        fs.readFileSync(
          path.join(projectDir, translationFile),
          { encoding: "utf8" }
        )
      );
      console.debug(`  -> translations: ${JSON.stringify(translations)}`);
      return translations;
    } catch (e) {
      console.error(chalk.red(`Error reading translation file: ${e}`));
      return {};
    }
  }

  static translateString(inputStr: string, translations: any): string {
    return inputStr.replace(/\$\{([^}]+)\}/g, (_, key) => {
      return key.split(".").reduce((value, k) => value?.[k], translations) ?? `\$\{${key}\}`;
    });
  }
}
