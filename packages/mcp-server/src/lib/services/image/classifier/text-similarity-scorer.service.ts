import { logger } from "../../utils";
import { EmbeddingConfig } from "../../utils";

export type Relation = "sameSubject" | "relatedTheme" | "looseLink" | "unrelated" | "noContext";

export interface ScoreResult {
    similarity: number;
    raw: number;
    relation: Relation;
    closestText: string;
    confidence: number;
}

const cosine = (a: number[], b: number[]) => {
    let dot = 0,
        na = 0,
        nb = 0;
    for (let i = 0; i < a.length; i++) {
        dot += a[i] * b[i];
        na += a[i] ** 2;
        nb += b[i] ** 2;
    }
    return dot / Math.sqrt(na * nb);
};

const rescale = (c: number, { low, high }: { low: number; high: number }) => Math.min(1, Math.max(0, (c - low) / (high - low)));

const toRelation = (s: number): Relation => {
    if (s >= 0.7) {
        return "sameSubject";
    }
    if (s >= 0.45) {
        return "relatedTheme";
    }
    if (s >= 0.2) {
        return "looseLink";
    }
    return "unrelated";
};

const splitSentences = (t: string) =>
    t
        .replace(/\s+/g, " ")
        .split(/(?<=[.!?…])\s+/)
        .map(s => s.trim())
        .filter(s => s.length >= 8);

// Fenêtres de 1 à 2 phrases pour garder un peu de contexte
const buildWindows = (sentences: string[]) => {
    const out = [...sentences];
    for (let i = 0; i < sentences.length - 1; i++) {
        out.push(`${sentences[i]} ${sentences[i + 1]}`);
    }
    return out;
};

const NEAR_CHARS = 300; // seul le texte proche de l'image est pertinent

export function createScorer(config: EmbeddingConfig) {
    return async function score(input: { imageDescription: string; textBefore: string; textAfter: string }): Promise<ScoreResult> {
        // Texte le plus proche de l'image : fin du "before", début du "after"
        const before = input.textBefore.trim().slice(-NEAR_CHARS);
        const after = input.textAfter.trim().slice(0, NEAR_CHARS);

        const candidates = [
            ...buildWindows(splitSentences(before)).map(text => ({ text, side: "before" as const })),
            ...buildWindows(splitSentences(after)).map(text => ({ text, side: "after" as const })),
        ];

        if (!candidates.length) {
            return { similarity: 0, raw: 0, relation: "noContext", closestText: "", confidence: 0.3 };
        }

        logger.debug("candidates");
        logger.debug(candidates);

        // Si ton modèle est asymétrique : embedQuery pour la description
        const img = await config.embeddings.embedQuery(input.imageDescription);
        const vecs = await config.embeddings.embedDocuments(candidates.map(c => c.text));

        const scored = candidates.map((c, i) => ({ ...c, raw: cosine(img, vecs[i]) }));
        scored.sort((a, b) => b.raw - a.raw);

        logger.debug("scored");
        logger.debug(scored);

        const best = scored[0];
        const second = scored[1]?.raw ?? best.raw;

        const similarity = rescale(best.raw, config.calibration);

        // Confiance basée sur la quantité de texte et l'écart entre les meilleurs scores,
        // plutôt qu'une constante
        const confidence = Math.min(0.9, 0.4 + Math.min(candidates.length, 10) * 0.03 + Math.max(0, best.raw - second) * 2);

        return {
            similarity,
            raw: best.raw,
            relation: toRelation(similarity),
            closestText: best.text,
            confidence,
        };
    };
}

