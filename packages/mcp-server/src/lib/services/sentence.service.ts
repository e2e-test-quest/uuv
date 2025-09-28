import { EN_ROLES, enBasedRoleSentences, enSentences } from "@uuv/runner-commons";

export type SentenceSearchQuery = {
    category?: string;
    role?: string;
};

export class SentenceService {
    private static getAllSentences() {
        return enSentences;
    }

    private static getSentencesByRole(role?: string) {
        const result = [];
        EN_ROLES.filter(r => !role || r.name === role).forEach(role => {
            enBasedRoleSentences.enriched
                .filter(
                    sentence =>
                        sentence.section === "general" ||
                        (sentence.section === "keyboard" && role.shouldGenerateKeyboardSentence) ||
                        (sentence.section === "click" && role.shouldGenerateClickSentence) ||
                        (sentence.section === "contains" && role.shouldGenerateContainsSentence) ||
                        (sentence.section === "type" && role.shouldGenerateTypeSentence) ||
                        (sentence.section === "checkable" && role.shouldGenerateCheckedSentence)
                )
                .map(sentence => {
                    return {
                        ...sentence,
                        role: role.name,
                        key: `${sentence.key}.role.${role.name.toLowerCase()}`,
                        wording: sentence.wording
                            .replaceAll("(n)", "")
                            .replaceAll("$roleName", role.name)
                            .replaceAll("$definiteArticle", role.getDefiniteArticle())
                            .replaceAll("$indefiniteArticle", role.getIndefiniteArticle())
                            .replaceAll("$namedAdjective", role.namedAdjective())
                            .replaceAll("$ofDefiniteArticle", role.getOfDefiniteArticle()),
                    };
                })
                .forEach(sentence => {
                    result.push(sentence);
                });
        });
        return result;
    }

    public static searchSentences(query: SentenceSearchQuery) {
        let sentences = [...this.getAllSentences()];

        sentences.push(...this.getSentencesByRole(query.role));

        if (query.category) {
            sentences = sentences.filter(s => s.section === query.category);
        }

        return sentences;
    }
}
