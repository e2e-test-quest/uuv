import { ClickElementService } from "./click-element.service";

describe("ClickElementService", () => {
    it("should generate script for accessible name and role", () => {
        const baseUrl = "http://example.com";
        const accessibleName = "Hello world";
        const accessibleRole = "button";

        const result = new ClickElementService().generateTestForElement({ baseUrl, accessibleName, accessibleRole });

        expect(result).toEqual(
            "Feature: Your amazing feature name\n" +
                "  Scenario: Action - An action\n" +
                `    Given I visit path "${baseUrl}"\n` +
                `    When I click on ${accessibleRole} named "${accessibleName}"\n`
        );
    });

    it("should generate script for domSelector", () => {
        const baseUrl = "http://example.com";
        const domSelector = ".fakeClass";

        const result = new ClickElementService().generateTestForElement({
            baseUrl,
            domSelector,
        });

        expect(result).toEqual(
            "Feature: Your amazing feature name\n" +
                "  Scenario: Action - An action\n" +
                `    Given I visit path "${baseUrl}"\n` +
                `    When within the element with selector "${domSelector}"\n` +
                "    Then I click\n"
        );
    });
});
