// eslint-disable-next-line dot-notation
process.env["PINO_LOG_LEVEL"] = "debug";
import { getLanguageModel, logger } from "../utils";

import { ArchitectService } from "./architect.service";

const targetUrl = process.argv[2] ?? "https://e2e-test-quest.github.io/weather-app/";
const scenario = process.argv[3] ?? "Add 'New-York' Town";
// eslint-disable-next-line dot-notation
// const llmModel = "ollama/gemma4:e4b";
const llmModel = "openai/unsloth/gemma-4-E4B-it-qat-GGUF:UD-Q4_K_XL";
// const llmModel = "openai/gpt-4.1-mini";
// eslint-disable-next-line dot-notation
// const llmApi = "http://localhost:11434";
// eslint-disable-next-line dot-notation
process.env["OPENAI_BASE_URL"] = "http://172.22.240.1:8888/v1";
// eslint-disable-next-line dot-notation
process.env["OPENAI_API_KEY"] = "sk-unsloth-11a2817a98c2045b472af0c2fd2b35ab";
let llmApi;

function validateArgs(targetUrl?: string, scenario?: string) {
    if (!targetUrl || !scenario) {
        logger.error("Usage: architect <targetUrl> \"<scenario description>\"");
        const message = "Example: architect https://make-it-soft.com \"Display homepage\"";
        logger.error(message);
        throw Error(message);
    }
}

async function main() {
    validateArgs(targetUrl, scenario);

    const architectService = new ArchitectService(getLanguageModel(llmModel, llmApi), false);
    console.time("genNominalTestCase");
    architectService.generateNominalCaseScenario(targetUrl, scenario)
        .then(result => {
            console.timeEnd("genNominalTestCase");
            logger.info(result);
        })
        .catch(err => {
            logger.error(err.message);
            process.exit(1);
        });
}

main();
