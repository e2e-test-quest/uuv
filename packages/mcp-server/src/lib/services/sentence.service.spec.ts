import { SentenceService } from "./sentence.service";

// Mock the imported data to avoid dependencies on external modules
jest.mock("@uuv/runner-commons", () => ({
    EN_ROLES: [
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
        },
    ],
    enBasedRoleSentences: {
        enriched: [
            { section: "general", key: "click-actions", wording: "Click $definiteArticle $roleName" },
            { section: "keyboard", key: "press-keyboard", wording: "Press $indefiniteArticle $roleName with keyboard" },
            { section: "contains", key: "contains-element", wording: "$definiteArticle $roleName contains '$value'" },
        ],
    },
    enSentences: [
        {
            section: "general",
            key: "key.then.element.withRoleAndName",
            wording: "I should see an element with role {string} and name {string}",
        },
    ],
}));

describe("SentenceService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("searchSentences", () => {
        it("should return all available sentences when neither category nor role is specified", () => {
            const result = SentenceService.searchSentences({});

            expect(result).toEqual([
                {
                    key: "key.then.element.withRoleAndName",
                    section: "general",
                    wording: "I should see an element with role {string} and name {string}",
                },
                {
                    key: "click-actions.role.button",
                    role: "button",
                    section: "general",
                    wording: "Click the button",
                },
                {
                    key: "press-keyboard.role.button",
                    role: "button",
                    section: "keyboard",
                    wording: "Press a button with keyboard",
                },
                {
                    key: "click-actions.role.input",
                    role: "input",
                    section: "general",
                    wording: "Click the input",
                },
                {
                    key: "press-keyboard.role.input",
                    role: "input",
                    section: "keyboard",
                    wording: "Press an input with keyboard",
                },
                {
                    key: "contains-element.role.input",
                    role: "input",
                    section: "contains",
                    wording: "the input contains '$value'",
                },
            ]);
        });

        it("should filter sentences by category when specified", () => {
            const result = SentenceService.searchSentences({ category: "keyboard" });

            expect(result).toEqual([
                {
                    key: "press-keyboard.role.button",
                    role: "button",
                    section: "keyboard",
                    wording: "Press a button with keyboard",
                },
                {
                    key: "press-keyboard.role.input",
                    role: "input",
                    section: "keyboard",
                    wording: "Press an input with keyboard",
                },
            ]);
        });

        it("should handle empty category filter", () => {
            const result = SentenceService.searchSentences({ category: "nonexistent" });

            // Should return empty array for non-existent category
            expect(result).toEqual([]);
        });

        it("should filter sentences by role when specified", () => {
            const result = SentenceService.searchSentences({ role: "button" });

            expect(result).toEqual([
                {
                    key: "key.then.element.withRoleAndName",
                    section: "general",
                    wording: "I should see an element with role {string} and name {string}",
                },
                {
                    key: "click-actions.role.button",
                    role: "button",
                    section: "general",
                    wording: "Click the button",
                },
                {
                    key: "press-keyboard.role.button",
                    role: "button",
                    section: "keyboard",
                    wording: "Press a button with keyboard",
                },
            ]);
        });
    });
});
