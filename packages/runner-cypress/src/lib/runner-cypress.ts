import { UUVCliOptions, UUVCliRunner, Common } from "@uuv/runner-commons";
import fs from "fs";
import path from "path";
import chalk from "chalk";
import { mergeFiles } from "junit-report-merger";
import report from "multiple-cucumber-html-reporter";
import cypress from "cypress";
import { updateChartJsVersion } from "@uuv/runner-commons/runner/utils";

export class UUVCliCypressRunner implements UUVCliRunner {
    name = "Cypress";
    defaultBrowser = "chrome";
    private E2E_REPORT_DIR!: string;
    private JSON_REPORT_DIR!: string;
    private CYPRESS_JUNIT_REPORT!: string[];
    private CUCUMBER_MESSAGES_FILE!: string;

    constructor(
        public projectDir
    ) {}

    getCurrentVersion(): string {
        const pJsonStr = fs.readFileSync(`${__dirname}/../../package.json`, {
            encoding: "utf8", flag: "r"
        });
        return JSON.parse(pJsonStr).version;
    }

    prepare(options: Partial<UUVCliOptions>) {
        if (options.baseUrl) {
            // eslint-disable-next-line dot-notation
            process.env["CYPRESS_BASE_URL"] = options.baseUrl;
        }
        if (options.report) {
            this.E2E_REPORT_DIR = path.join(options.report.outputDir, "e2e");
            this.JSON_REPORT_DIR = path.join(this.E2E_REPORT_DIR, "json");
            this.CYPRESS_JUNIT_REPORT = [`${this.projectDir}/reports/e2e/junit-report-*.xml`];
            this.CUCUMBER_MESSAGES_FILE = path.join(this.projectDir, "cucumber-messages.ndjson");
            this.createReportDirectories({ report: options.report });
        }
    }

    executeE2eCommand(options: Partial<UUVCliOptions>) {
        const cypressOptions: Partial<CypressCommandLine.CypressRunOptions> = {
            project: this.projectDir,
            browser: options.browser,
            env: {
                uuvOptions: options,
                ...options.extraArgs
            }
        };

        if (options.report?.junit.enabled) {
            cypressOptions.reporter = "junit";
            cypressOptions.reporterOptions = {
                mochaFile: "reports/e2e/junit-report-[hash].xml"
            };
        }

        if (options.targetTestFile) {
            cypressOptions.spec = options.targetTestFile;
        }

        // Running Tests
        return this.getCypress()
            .run(cypressOptions)
            .then(async (result) => {
                if (options.report?.junit.enabled) {
                    await this.mergeJunitReport(this.CYPRESS_JUNIT_REPORT, options.report.junit.outputFile);
                }
                if (options.report?.html.enabled) {
                    await this.generateHtmlReport(options, options.report.html.outputDir);
                }
                if (fs.existsSync(this.CUCUMBER_MESSAGES_FILE)) {
                    fs.rmSync(this.CUCUMBER_MESSAGES_FILE);
                }
                if ("totalFailed" in result) {
                    console.log(`Status ${result.totalFailed ? chalk.red("failed") : chalk.green("success")}`);
                    this.terminateProcess(result.totalFailed === 0 ? 0 : 2);
                }
                this.terminateProcess(0);
            })
            .catch(async (err) => {
                console.error(chalk.red(err));
                if (options.report?.junit.enabled) {
                    await this.mergeJunitReport(this.CYPRESS_JUNIT_REPORT, options.report.junit.outputFile);
                }
                this.terminateProcess(2);
            });
    }

    executeOpenCommand(options: Partial<UUVCliOptions>) {
        return this.getCypress().open({
            project: this.projectDir,
            env: {
                uuvOptions: options,
                ...options.extraArgs
            },
        });
    }

    private createReportDirectories(options: Pick<UUVCliOptions, "report">) {
        if (!fs.existsSync(options.report.outputDir)) {
            fs.mkdirSync(options.report.outputDir);
        }

        if (fs.existsSync(this.E2E_REPORT_DIR)) {
            Common.deleteAllFileOfDirectory(this.E2E_REPORT_DIR);
        } else {
            fs.mkdirSync(this.E2E_REPORT_DIR, { recursive: true });
        }

        if (!fs.existsSync(this.JSON_REPORT_DIR)) {
            fs.mkdirSync(this.JSON_REPORT_DIR, { recursive: true });
        }
    }

    private terminateProcess(exitCode) {
        process.exit(exitCode);
    }

    private async mergeJunitReport(inputFiles: string[], outputFile: string) {
        console.info(chalk.blueBright("Generating Junit Test Report..."));
        await mergeFiles(outputFile, inputFiles);
        console.info(chalk.blueBright(`Junit Test Report generated: ${outputFile}\n`));
    }

    private async generateHtmlReport(options: Partial<UUVCliOptions>, reportDir: string) {
        console.info(chalk.blueBright("Generating Html Test Report..."));
        this.generateHtmlReportFromJson(options, this.JSON_REPORT_DIR, reportDir);
        updateChartJsVersion(reportDir, "2.5.0", "2.6.0");
    }

    private generateHtmlReportFromJson(options: Partial<UUVCliOptions>, jsonReportDir: string, htmlReportDir: string) {
        const UNKNOWN_VALUE = "unknown";
        report.generate({
            jsonDir: jsonReportDir,
            reportPath: htmlReportDir,
            useCDN: true,
            metadata: {
                browser: {
                    name: options.browser,
                    version: options.extraArgs?.browserVersion ? options.extraArgs.browserVersion : "",
                },
                device: options.extraArgs?.device ? options.extraArgs.device : UNKNOWN_VALUE,
                platform: {
                    name: options.extraArgs?.platformName ? options.extraArgs.platformName : UNKNOWN_VALUE,
                    version: options.extraArgs?.platformVersion ? options.extraArgs.platformVersion : "",
                },
            },
        });
    }

    private getCypress() {
        return cypress;
    }
}
