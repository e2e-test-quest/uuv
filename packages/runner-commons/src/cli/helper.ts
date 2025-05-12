import chalk from "chalk";
import figlet from "figlet";
import minimist from "minimist";
import path from "path";
import { UUV_TARGET_COMMAND, UUVCliOptions } from "./options";
import { isEmpty } from "lodash";
import cp from "child_process";
import { cosmiconfig } from "cosmiconfig";
import { Translator } from '../translator';

export class UUVCliHelper {
    /**
     * Print runner banner
     */
    static printBanner(runnerName:string, currentVersion: string) {
        console.log(
            chalk.blueBright(
                figlet.textSync(`UUV - ${runnerName}`, {
                    font: "Big",
                    horizontalLayout: "default",
                    verticalLayout: "default",
                    width: 80,
                    whitespaceBreak: true
                })
            )
        );
        console.info(chalk.blueBright(`Version: ${currentVersion}\n\n`));
    }

    static checkTargetCommand() {
        const argv: any = minimist(process.argv.slice(2));
        if (argv._.length < 1) {
            throw new Error("No command specified");
        }
    }

    static checkTargetTestFiles() {
        const argv: any = minimist(process.argv.slice(2));
        const targetTestFile = argv.targetTestFile;
        if (!isEmpty(targetTestFile)) {
            try {
                new RegExp(targetTestFile, "gi");
            } catch (e) {
                throw new Error("Invalid targetTestFile argument, this args should respect Glob pattern");
            }
        }
    }

    private static getTargetCommand(argv): UUV_TARGET_COMMAND {
        return UUV_TARGET_COMMAND[(argv._[0]).toUpperCase()];
    }

    static async readUUVConfig(): Promise<Partial<UUVCliOptions>> {
      const explorer = cosmiconfig("uuv");
      const configResult = await explorer.search();

      return configResult ? configResult.config : {};
    }

    static async extractArgs(projectDir: string, defaultBrowser): Promise<Partial<UUVCliOptions>> {
        const argv: any = minimist(process.argv.slice(2));
        const browser = argv.browser ? argv.browser : defaultBrowser;
        const env = argv.env ? JSON.parse(argv.env.replace(/'/g, "\"")) : {};
        const targetTestFile = argv.targetTestFile ? argv.targetTestFile : null;
        const uuvConfig = await this.readUUVConfig();

        const reportDir = path.join(projectDir, "reports");
        // eslint-disable-next-line dot-notation
        process.env["ENABLE_TEAMCITY_LOGGING"] = env.enableTeamcityLogging;
        // eslint-disable-next-line dot-notation
        process.env["ENABLE_VSCODE_LISTENER"] = env.enableVsCodeListener;

        console.debug(`  -> uuvConfig: ${JSON.stringify(uuvConfig)}`);
        const translationFile = argv.translationFile ?? uuvConfig.translationFile;

      const processCwd = process.cwd();
      return {
            // eslint-disable-next-line dot-notation
            baseUrl: process.env["UUV_BASE_URL"],
            projectDir: processCwd,
            browser,
            extraArgs: env,
            targetTestFile,
            command: this.getTargetCommand(argv),
            translationFile: translationFile,
            translations: Translator.readTranslationFile(processCwd, translationFile),
            report: {
                outputDir: reportDir,
                a11y: {
                    enabled: argv.generateA11yReport,
                    relativePath: path.join("reports", "a11y-report.json"),
                    outputFile: path.join(processCwd, reportDir, "a11y-report.json")
                },
                html: {
                    enabled: argv.generateHtmlReport,
                    outputDir: path.join(reportDir, "e2e/html")
                },
                junit: {
                    enabled: argv.generateJunitReport,
                    outputFile: path.join(reportDir, "e2e/junit-report.xml")
                }
            }
        };
    }

    static printVariables(options: Partial<UUVCliOptions>) {
        console.debug(chalk.yellowBright("Variables: "));
        if (options.baseUrl) {
            console.debug(`  -> baseUrl: ${options.baseUrl}`);
        }
        console.debug(`  -> projectDir: ${options.projectDir}`);
        console.debug(`  -> browser: ${options.browser}`);
        console.debug(`  -> report: ${JSON.stringify(options.report)}`);
        console.debug(`  -> env: ${JSON.stringify(options.extraArgs)}`);
        if (options.targetTestFile) {
            console.debug(`  -> targetTestFile: ${options.targetTestFile}`);
        }
        if (options.translationFile) {
          console.debug(`  -> translationFile: ${options.translationFile}`);
          console.debug(`  -> translations: ${JSON.stringify(options.translations)}`);
        }
        console.debug("\n");
    }

    static startIpcServer () {
        return cp.fork(path.join(__dirname, "start-ipc-server"));
    }

    static stopIpcServer (ipcServerProcess: cp.ChildProcess) {
        return ipcServerProcess.kill();
    }
}
