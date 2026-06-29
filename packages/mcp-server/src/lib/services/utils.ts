import { createOllama } from "ai-sdk-ollama";
import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";
import { google } from "@ai-sdk/google";
import { LanguageModel } from "ai";
import pino from "pino";

export const logger = pino({
    // eslint-disable-next-line dot-notation
    level: process.env["PINO_LOG_LEVEL"] || "info",
    transport: {
        target: "pino-pretty",
    },
});

export function getLanguageModel(llmModel: string, llmApi?: string): LanguageModel {
    const providers = {
        openai,
        anthropic,
        google,
        ollama: createOllama({
            baseURL: llmApi,
        }),
    };

    const [provider, modelName] = llmModel.split("/");
    return providers[provider](modelName);
}
