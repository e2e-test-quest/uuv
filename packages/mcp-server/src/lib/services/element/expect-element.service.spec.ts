import { ExpectElementService } from "./expect-element.service";

describe("ExpectElementService", () => {
    it("should generate script for accessible name and role", () => {
        const baseUrl = "http://example.com";
        const accessibleName = "Hello world";
        const accessibleRole = "button";

        const result = new ExpectElementService().generateTestForElement({ baseUrl, accessibleName, accessibleRole });

        expect(result).toEqual(
            "Feature: Your amazing feature name\n" +
                "  Scenario: Action - An action\n" +
                `    Given I visit path "${baseUrl}"\n` +
                `    Then I should see a ${accessibleRole} named "${accessibleName}"\n`
        );
    });

    it("should generate script for domSelector", () => {
        const baseUrl = "http://example.com";
        const domSelector = ".fakeClass";

        const result = new ExpectElementService().generateTestForElement({
            baseUrl,
            domSelector,
        });

        expect(result).toEqual(
            "Feature: Your amazing feature name\n" +
                "  Scenario: Action - An action\n" +
                `    Given I visit path "${baseUrl}"\n` +
                `    Then I should see an element with selector "${domSelector}"\n`
        );
    });
});
