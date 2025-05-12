import { UUVCliRunner } from "./runner";
import { UUVCliHelper } from "./helper";
import chalk from "chalk";
import { UUV_TARGET_COMMAND } from "./options";

export class UUVCliEngine {
    constructor(
        private runner: UUVCliRunner
    ) {}

    async execute() {
        let ipcServerProcess;
        try {
            UUVCliHelper.printBanner(this.runner.name, this.runner.getCurrentVersion());

            this.checkArguments();

            const options = await UUVCliHelper.extractArgs(this.runner.projectDir, this.runner.defaultBrowser);

            UUVCliHelper.printVariables(options);

            if (options.command === undefined ) {
                throw new Error("Unknown command");
            }

            ipcServerProcess = UUVCliHelper.startIpcServer();

            await this.runner.prepare(options);

            console.info(chalk.blueBright(`Executing UUV command ${options.command}...`));

            switch (options.command) {
                case UUV_TARGET_COMMAND.OPEN:
                    await this.runner.executeOpenCommand(options);
                    break;
                case UUV_TARGET_COMMAND.RUN:
                case UUV_TARGET_COMMAND.E2E:
                    await this.runner.executeE2eCommand(options);
                    break;
            }

            console.info(`UUV command ${options.command} executed`);
        } catch (e) {
            console.error(chalk.red(e));
            process.exit(1);
        } finally {
            if (ipcServerProcess) {
                UUVCliHelper.stopIpcServer(ipcServerProcess);
            }
        }
    }

    private checkArguments() {
        UUVCliHelper.checkTargetCommand();
        UUVCliHelper.checkTargetTestFiles();
    }
}
