import { SentenceService } from "../sentence.service";
import { getDefinedDictionary } from "@uuv/dictionary";

export class GeneralElementService {
     findSentenceFromKey(key: string, targetUrl: string): string {
        const dictionary = getDefinedDictionary("en");
        const sentenceService = new SentenceService(dictionary);
        const allSentences = sentenceService.searchSentences({ key });
        return dictionary.computeSentence({
            sentence: allSentences[0],
            accessibleRole: "",
            parameters: [targetUrl],
        });
    }
}
