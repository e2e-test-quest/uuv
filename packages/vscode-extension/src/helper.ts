import * as vscode from "vscode";
import { AstBuilder, GherkinClassicTokenMatcher, Parser } from "@cucumber/gherkin";
import { v4 as uuidv4 } from "uuid";


const builder = new AstBuilder(() => uuidv4());
const matcher = new GherkinClassicTokenMatcher();
const parser = new Parser(builder, matcher);
const UUV_TERMINAL_NAME = "UUV";
const UUV_VSCODE_CONFIGURATION_SECTION = "uuv";
const DEFAULT_PROJECT_DIR = ".";
export const UUV_COMMAND_TIMEOUT = 120000;

export class Helper {
    static getUUVTerminal() {
        const existingTerminal = vscode.window.terminals.find(terminal => terminal.name === UUV_TERMINAL_NAME);
        if (existingTerminal) {
            existingTerminal.dispose();
        }
        return vscode.window.createTerminal(UUV_TERMINAL_NAME);
    }

    static parseTestsInDocument(testController: vscode.TestController, e: vscode.TextDocument) {
        if (e.uri.scheme === "file" && e.uri.path.startsWith("uuv/") && e.uri.path.endsWith(".feature")) {
          this.parseTestsInFileContents(testController, this.getOrCreateFile(testController, e.uri), e.getText());
        }
    }

    static async parseTestsInFileContents(testController: vscode.TestController, file: vscode.TestItem, contents?: string) {
        // If a document is open, VS Code already knows its contents. If this is being
        // called from the resolveHandler when a document isn't open, we'll need to
        // read them from disk ourselves.
        if (contents === undefined) {
            const rawContent = await vscode.workspace.fs.readFile(file.uri!);
            contents = new TextDecoder().decode(rawContent);
        }

        Helper.clearAllChildren(file);

        if (contents) {
            Helper.buildChildren(contents, file, testController);
        }
    }

    private static buildChildren(contents: string, file: vscode.TestItem, testController: vscode.TestController) {
        const gherkinDocument = parser.parse(contents);
        gherkinDocument.feature?.children.forEach(featureChild => {
            if (featureChild.scenario?.name) {
                file.children.add(
                    testController.createTestItem(
                        `${file.id}-${featureChild.scenario.name}`,
                        featureChild.scenario.name
                    )
                );
            }
        });
    }

    private static clearAllChildren(file: vscode.TestItem) {
        const childrenId: string[] = [];
        file.children.forEach(child => childrenId.push(child.id));
        for (let index = 0; index < childrenId.length; index++) {
            file.children.delete(childrenId[index]);
        }
    }

    // In this function, we'll get the file TestItem if we've already found it,
    // otherwise we'll create it with `canResolveChildren = true` to indicate it
    // can be passed to the `controller.resolveHandler` to gets its children.
    static getOrCreateFile(testController: vscode.TestController, uri: vscode.Uri): vscode.TestItem {
        const existing = testController.items.get(uri.toString());
        if (existing) {
            return existing;
        }

        const file = testController.createTestItem(uri.toString(), uri.path.split("/").pop()!, uri);
        file.canResolveChildren = true;
        return file;
    }

    static getTestFile(test: vscode.TestItem): vscode.Uri | undefined {
        let uri = test.uri;
        while (!uri && test.parent) {
            uri = test.parent?.uri;
        }
        return uri;
    }

    static initUUVConsoleCommandWithProjectDir(): string {
        const uuvExtconfiguration = vscode.workspace.getConfiguration(UUV_VSCODE_CONFIGURATION_SECTION);
        if (uuvExtconfiguration.get("projectHomeDir") && uuvExtconfiguration.get("projectHomeDir") !== DEFAULT_PROJECT_DIR) {
            return `cd ${uuvExtconfiguration.get("projectHomeDir")} && `;
        }
        return "";
    }

    static buildUUVConsoleCommand(target: "open" | "e2e"): string {
        let command = this.initUUVConsoleCommandWithProjectDir();

        const uuvExtconfiguration = vscode.workspace.getConfiguration(UUV_VSCODE_CONFIGURATION_SECTION);
        command = `${command}${uuvExtconfiguration.get("useLocalScript") === true ? "npm run uuv" : "npx uuv"}`;

        return `${command} ${target}`;
    }

    static buildUUVAssistantConsoleCommand(targetUrl: string): string {
        let command = this.initUUVConsoleCommandWithProjectDir();

        const uuvExtconfiguration = vscode.workspace.getConfiguration(UUV_VSCODE_CONFIGURATION_SECTION);
        command = `${command}${uuvExtconfiguration.get("useLocalScript") === true ? "npm run uuv-assistant" : "npx uuv-assistant"}`;

        return `${command} --targetUrl="${targetUrl}"`;
    }
}
