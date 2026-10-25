import pino from "pino";
import { ChatOllama, OllamaEmbeddings } from "@langchain/ollama";
import type { EmbeddingsInterface } from "@langchain/core/embeddings";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { ChatAnthropic } from "@langchain/anthropic";
import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

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
                temperature: 0.0,
                topP: 0.95,
                numCtx: 32768,
            });
        case "openai":
            return new ChatOpenAI(modelName);
        case "anthropic":
            return new ChatAnthropic(modelName);
        case "google":
            return new ChatGoogleGenerativeAI(modelName);
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

export interface EmbeddingConfig {
    embeddings: EmbeddingsInterface;
    calibration: { low: number; high: number };
}

// Modèle d'embedding par défaut selon le fournisseur du LLM
const DEFAULT_EMBEDDING: Record<string, string> = {
    ollama: "bge-m3",
    openai: "text-embedding-3-small",
    google: "gemini-embedding-001",
    // anthropic : pas de modèle d'embeddings, voir le fallback plus bas
};

// Placeholders à mesurer pour chaque modèle
const CALIBRATION: Record<string, { low: number; high: number }> = {
    "text-embedding-3-small": { low: 0.15, high: 0.55 },
    "bge-m3": { low: 0.3, high: 0.7 },
    "gemini-embedding-001": { low: 0.4, high: 0.8 },
};
const DEFAULT_CALIBRATION = { low: 0.15, high: 0.55 };

export function getEmbeddingModelFor(
    llmModel: string,
    llmApi?: string,
    override?: string, // ex: "openai/text-embedding-3-small"
    fallback = "ollama/bge-m3" // utilisé si le fournisseur n'a pas d'embeddings
): EmbeddingConfig {
    const [llmProvider] = decomposeModel(llmModel);

    let provider = llmProvider;
    let modelName = DEFAULT_EMBEDDING[llmProvider];

    if (override) {
        [provider, modelName] = decomposeModel(override);
    } else if (!modelName) {
        // Ex: anthropic
        logger.warn(`No embedding model for "${llmProvider}", falling back to "${fallback}"`);
        [provider, modelName] = decomposeModel(fallback);
    }

    const calibration = CALIBRATION[modelName] ?? DEFAULT_CALIBRATION;
    if (!CALIBRATION[modelName]) {
        logger.warn(`No calibration for "${modelName}", using default values`);
    }

    switch (provider) {
        case "ollama":
            return { embeddings: new OllamaEmbeddings({ model: modelName, baseUrl: llmApi }), calibration };
        case "openai":
            return { embeddings: new OpenAIEmbeddings({ model: modelName }), calibration };
        case "google":
            return { embeddings: new GoogleGenerativeAIEmbeddings({ model: modelName }), calibration };
        default:
            throw new Error(`Embedding provider "${provider}" not supported`);
    }
}
