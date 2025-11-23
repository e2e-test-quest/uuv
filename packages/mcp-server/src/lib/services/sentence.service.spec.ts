import { SentenceService } from "./sentence.service";
import { getDefinedDictionary } from "@uuv/dictionary";

describe("SentenceService", () => {
    const mockDictionary = getDefinedDictionary("en");

    beforeEach(() => {
        jest.clearAllMocks();
        // eslint-disable-next-line dot-notation
        mockDictionary["roles"] = [
            {
                name: "button",
                shouldGenerateKeyboardSentence: true,
                shouldGenerateClickSentence: true,
                shouldGenerateContainsSentence: false,
                shouldGenerateTypeSentence: false,
                shouldGenerateCheckedSentence: false,
                getDefiniteArticle: () => "the",
                getIndefiniteArticle: () => "a",
                namedAdjective: () => "named",
                getOfDefiniteArticle: () => "of the",
                id: "1",
            },
            {
                name: "input",
                shouldGenerateKeyboardSentence: true,
                shouldGenerateClickSentence: false,
                shouldGenerateContainsSentence: true,
                shouldGenerateTypeSentence: true,
                shouldGenerateCheckedSentence: false,
                getDefiniteArticle: () => "the",
                getIndefiniteArticle: () => "an",
                namedAdjective: () => "named",
                getOfDefiniteArticle: () => "of the",
                id: "2"
            },
        ];
        // eslint-disable-next-line dot-notation
        mockDictionary["getBaseSentences"] = jest.fn().mockImplementation(() => [
            {
                section: "general",
                key: "key.then.element.withRoleAndName",
                wording: "I should see an element with role {string} and name {string}",
            },
        ]);
        // eslint-disable-next-line dot-notation
        mockDictionary["roleBasedSentencesTemplate"] = [
            { section: "general", key: "click-actions", wording: "Click $definiteArticle $roleName", description: "1" },
            { section: "keyboard", key: "press-keyboard", wording: "Press $indefiniteArticle $roleName with keyboard", description: "2" },
            { section: "contains", key: "contains-element", wording: "$definiteArticle $roleName contains '$value'", description: "3" },
        ];
    });

    describe("searchSentences", () => {
        it("should return all available sentences when neither category nor role is specified", () => {
            const result = new SentenceService(mockDictionary).searchSentences({});

            expect(result).toEqual([
                {
                    key: "key.then.element.withRoleAndName",
                    section: "general",
                    wording: "I should see an element with role {string} and name {string}"
                },
                {
                    key: "click-actions.role.button",
                    role: "button",
                    section: "general",
                    wording: "Click the button",
                    description: "1"
                },
                {
                    key: "press-keyboard.role.button",
                    role: "button",
                    section: "keyboard",
                    wording: "Press a button with keyboard",
                    description: "2"
                },
                {
                    key: "click-actions.role.input",
                    role: "input",
                    section: "general",
                    wording: "Click the input",
                    description: "1"
                },
                {
                    key: "press-keyboard.role.input",
                    role: "input",
                    section: "keyboard",
                    wording: "Press an input with keyboard",
                    description: "2"
                },
                {
                    key: "contains-element.role.input",
                    role: "input",
                    section: "contains",
                    wording: "the input contains '$value'",
                    description: "3"
                },
            ]);
        });

        it("should filter sentences by category when specified", () => {
            const result = new SentenceService(mockDictionary).searchSentences({ category: "keyboard" });

            expect(result).toEqual([
                {
                    key: "press-keyboard.role.button",
                    role: "button",
                    section: "keyboard",
                    wording: "Press a button with keyboard",
                    description: "2"
                },
                {
                    key: "press-keyboard.role.input",
                    role: "input",
                    section: "keyboard",
                    wording: "Press an input with keyboard",
                    description: "2"
                },
            ]);
        });

        it("should handle empty category filter", () => {
            const result = new SentenceService(mockDictionary).searchSentences({ category: "nonexistent" });

            // Should return empty array for non-existent category
            expect(result).toEqual([]);
        });

        it("should filter sentences by role when specified", () => {
            const result = new SentenceService(mockDictionary).searchSentences({ role: "button" });

            expect(result).toEqual([
                {
                    key: "click-actions.role.button",
                    role: "button",
                    section: "general",
                    wording: "Click the button",
                    description: "1"
                },
                {
                    key: "press-keyboard.role.button",
                    role: "button",
                    section: "keyboard",
                    wording: "Press a button with keyboard",
                    description: "2"
                },
            ]);
        });
    });
});
