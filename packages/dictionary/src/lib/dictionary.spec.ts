import { Dictionary } from "./dictionary";
import { AccessibleRole } from "./accessible-role";

class TestDictionary extends Dictionary {
    protected override baseSentences = [
        {
            key: "test.key",
            description: "Test description",
            wording: "This is a test"
        }
    ];

    protected override roleBasedSentencesTemplate = [
        {
            key: "role.test.key",
            description: "Role based test description",
            wording: "I should see $indefiniteArticle $roleName named {string}",
            section: "general"
        }
    ];

    protected override roles: AccessibleRole[] = [
        {
            id: "button",
            name: "button",
            shouldGenerateClickSentence: true,
            shouldGenerateTypeSentence: false,
            shouldGenerateContainsSentence: false,
            shouldGenerateKeyboardSentence: true,
            shouldGenerateCheckedSentence: false,
            getDefiniteArticle(): string {
                return "the";
            },
            getIndefiniteArticle(): string {
                return "a";
            },
            getOfDefiniteArticle(): string {
                return "of the";
            },
            namedAdjective(): string {
                return "named";
            }
        }
    ];
}

describe("Dictionary", () => {
    let dictionary: TestDictionary;

    beforeEach(() => {
        dictionary = new TestDictionary();
    });

    describe("getBaseSentences", () => {
        it("should return base sentences", () => {
            const result = dictionary.getBaseSentences();
            expect(result).toHaveLength(1);
            expect(result[0].key).toBe("test.key");
        });
    });

    describe("getRoleBasedSentencesTemplate", () => {
        it("should return role based sentence templates", () => {
            const result = dictionary.getRoleBasedSentencesTemplate();
            expect(result).toHaveLength(1);
            expect(result[0].key).toBe("role.test.key");
        });
    });

    describe("getDefinedRoles", () => {
        it("should return defined roles", () => {
            const result = dictionary.getDefinedRoles();
            expect(result).toHaveLength(1);
            expect(result[0].id).toBe("button");
        });
    });

    describe("getRoleBasedSentences", () => {
        it("should generate role based sentences for all sections", () => {
            const result = dictionary.getRoleBasedSentences();
            expect(result).toHaveLength(1); // Only one role, so only one sentence generated
            expect(result[0].key).toBe("role.test.key.role.button");
            expect(result[0].role).toBe("button");
        });

        it("should properly replace placeholders in sentences", () => {
            const result = dictionary.getRoleBasedSentences();
            // The template has $indefiniteArticle and $roleName which should be replaced
            expect(result[0].wording).toContain("a button named");
        });
    });

    describe("computeSentence", () => {
        it("should compute sentence with mock value", () => {
            const input = {
                sentence: {
                    key: "test.key",
                    description: "Test description",
                    wording: "I type the sentence {string} in $definiteArticle $roleName named {string}"
                },
                mock: "test value",
                accessibleRole: "button",
                parameters: [ "myButton" ]
            };

            const result = dictionary.computeSentence(input);
            expect(result).toEqual("I type the sentence \"test value\" in the button named \"myButton\"");
        });

        it("should compute sentence with parameters", () => {
            const input = {
                sentence: {
                    key: "test.key",
                    description: "Test description",
                    wording: "I click on $roleName named {string} and containing {string}"
                },
                accessibleRole: "button",
                parameters: ["parameter1", "parameter2"]
            };

            const result = dictionary.computeSentence(input);
            expect(result).toEqual("I click on button named \"parameter1\" and containing \"parameter2\"");
        });

        it("should handle missing role gracefully", () => {
            const input = {
                sentence: {
                    key: "test.key",
                    description: "Test description",
                    wording: "I type the sentence {string} in $definiteArticle $roleName named {string}"
                },
                accessibleRole: "nonexistent-role",
                parameters: []
            };

            const result = dictionary.computeSentence(input);
            expect(result).toEqual("I type the sentence {string} in undefined nonexistent-role named {string}");
        });
    });
});
