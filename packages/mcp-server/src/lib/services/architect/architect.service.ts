import { logger } from "../utils";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { ArchitectExplorerService } from "./explorer/architect-explorer.service";
import { ArchitectFormatterService } from "./formatter/architect-formatter.service";
import { initLogger } from "braintrust";


export class ArchitectService {
    private readonly explorer!: ArchitectExplorerService;
    private readonly formatter!: ArchitectFormatterService;

    constructor(
        private readonly model: BaseChatModel
    ) {
        initLogger({
            projectName: "UUV Assistant AI",
            // eslint-disable-next-line dot-notation
            apiKey: process.env["BRAINTRUST_API_KEY"],
        });
        this.explorer = new ArchitectExplorerService(this.model);
        this.formatter = new ArchitectFormatterService();
    }

    async generateNominalCaseScenario(targetUrl: string, scenario: string, isBrowserHeadless = true): Promise<string | null> {
        logger.debug(`targetUrl: ${targetUrl} - scenario: ${scenario}`);

        const explorationSteps = await this.explorer.explore(targetUrl, scenario, isBrowserHeadless);

        logger.debug("explorationSteps");
        logger.debug(explorationSteps);

        const scenarioResultRaw = await this.explorer.buildScenario(explorationSteps);

        logger.debug("scenarioResultRaw");
        logger.debug(scenarioResultRaw);

        return this.formatter.formatScenario(scenarioResultRaw);
    }
}
