import { logger } from "../utils";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { ArchitectExplorerService } from "./explorer/architect-explorer.service";
import { ArchitectFormatterService } from "./formatter/architect-formatter.service";
import { getLangWatchTracer } from "langwatch";
import { setupObservability } from "langwatch/observability/node";
import { LangWatchTracer } from "langwatch/observability";


export class ArchitectService {
    private readonly explorer!: ArchitectExplorerService;
    private readonly tracer!: LangWatchTracer;
    private readonly formatter!: ArchitectFormatterService;

    constructor(
        private readonly model: BaseChatModel,
        private readonly isBrowserHeadless = true
    ) {
        setupObservability({
            serviceName: "@uuv/mcp-server",
            advanced: {
                // eslint-disable-next-line dot-notation
                disabled: !process.env["LANGWATCH_API_KEY"],
            },
        });
        this.tracer = getLangWatchTracer("architect");
        this.explorer = new ArchitectExplorerService(this.model, this.isBrowserHeadless);
        this.formatter = new ArchitectFormatterService();
    }

    async generateNominalCaseScenario(targetUrl: string, scenario: string): Promise<string | null> {
        return await this.tracer.withActiveSpan("generateNominalCaseScenario", async () => {
            logger.debug(`targetUrl: ${targetUrl} - scenario: ${scenario}`);

            const explorationSteps = await this.tracer.withActiveSpan("exploration", async span => {
                span.setAttributes({ targetUrl, scenario });
                return await this.explorer.explore(targetUrl, scenario);
            });

            logger.debug("explorationSteps");
            logger.debug(explorationSteps);

            const scenarioResultRaw = await this.tracer.withActiveSpan("buildScenario", async () => {
                return await this.explorer.buildScenario(explorationSteps);
            });

            logger.debug("scenarioResultRaw");
            logger.debug(scenarioResultRaw);

            return this.formatter.formatScenario(scenarioResultRaw);
        });
    }
}
