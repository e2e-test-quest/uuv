import pino from "pino";
import { ChatOllama } from "@langchain/ollama";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { ChatOpenAI } from "@langchain/openai";
import { ChatAnthropic } from "@langchain/anthropic";
import { ChatGoogle } from "@langchain/google";

export const logger = pino({
    // eslint-disable-next-line dot-notation
    level: process.env["PINO_LOG_LEVEL"] || "info",
    transport: {
        target: "pino-pretty",
    },
});

function decomposeModel(input: string): [string, string] {
    const firstSlashIndex = input.indexOf("/");

    if (firstSlashIndex === -1) {
        return [input, ""];
    }

    const provider = input.substring(0, firstSlashIndex);
    const modelName = input.substring(firstSlashIndex + 1);

    return [provider, modelName];
}

export function getLanguageModel(llmModel: string, llmApi?: string): BaseChatModel {
    logger.debug(`llmModel: ${llmModel} - llmApi: ${llmApi}`);
    const [provider, modelName] = decomposeModel(llmModel);
    logger.debug(`provider: ${provider} - modelName: ${modelName}`);
    switch (provider) {
        case "ollama":
            // eslint-disable-next-line dot-notation
            process.env["OLLAMA_BASE_URL"] = llmApi;
            return new ChatOllama({
                model: modelName,
                temperature: 1.0,
                topP: 0.95,
                numCtx: 32768,
            });
        case "openai":
            return new ChatOpenAI(modelName);
        case "anthropic":
            return new ChatAnthropic(modelName);
        case "google":
            return new ChatGoogle(modelName);
        default:
            throw new Error("Model not suppported yet!");
    }
}

export function getBooleanEnv(propertyName: string, defaultValue = true): boolean {
    return ["true", "1", "yes"].includes(
        // eslint-disable-next-line dot-notation
        (process.env[propertyName] || `${defaultValue}`).toLowerCase()
    );
}
