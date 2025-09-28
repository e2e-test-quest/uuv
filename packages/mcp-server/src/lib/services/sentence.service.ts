import { Dictionary, RoleBasedSentence } from "@uuv/dictionary";

export type SentenceSearchQuery = {
    category?: string;
    role?: string;
};

export class SentenceService {
    constructor(private dictionary: Dictionary) {
    }
    private getBaseSentences() {
        return this.dictionary.getBaseSentences();
    }

    private getSentencesByRole(role?: string) {
        return this.dictionary.getRoleBasedSentences().filter(r => !role || r.role === role);
    }

    public searchSentences(query: SentenceSearchQuery) {
        let sentences = [...this.getBaseSentences()];

        sentences.push(...this.getSentencesByRole(query.role));

        if (query.category) {
            sentences = sentences.filter(s => (s as RoleBasedSentence).section === query.category);
        }

        return sentences;
    }
}
