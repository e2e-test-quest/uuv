// eslint-disable-next-line dot-notation
process.env["PINO_LOG_LEVEL"] = "debug";

import { validateArgs, generateScenario, logger } from "./architect.service";

const targetUrl = process.argv[2];
const scenario = process.argv[3];
// eslint-disable-next-line dot-notation
const llmModel = process.env["UUV_LLM_MODEL"] ?? "anthropic/claude-sonnet-4.6";
// eslint-disable-next-line dot-notation
const llmApi = process.env["UUV_LLM_API"];

validateArgs(targetUrl, scenario);

console.time("genNominalTestCase");
generateScenario(targetUrl, scenario, llmModel, llmApi)
    .then(result => {
        console.timeEnd("genNominalTestCase");
        logger.debug(result);
    })
    .catch((err) => {
        logger.error(err.message);
        process.exit(1);
    });
