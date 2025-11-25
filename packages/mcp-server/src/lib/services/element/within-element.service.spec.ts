import { WithinElementService } from "./within-element.service";

describe("WithinElementService", () => {
    it("should generate script for accessible name and role", () => {
        const baseUrl = "http://example.com";
        const accessibleName = "Hello world";
        const accessibleRole = "button";

        const result = new WithinElementService().generateTestForElement({ baseUrl, accessibleName, accessibleRole });

        expect(result).toEqual(
            "Feature: Your amazing feature name\n" +
                "  Scenario: Action - An action\n" +
                `    Given I visit path "${baseUrl}"\n` +
                `    When within a ${accessibleRole} named "${accessibleName}"\n`
        );
    });

    it("should generate script for domSelector", () => {
        const baseUrl = "http://example.com";
        const domSelector = ".fakeClass";

        const result = new WithinElementService().generateTestForElement({
            baseUrl,
            domSelector,
        });

        expect(result).toEqual(
            "Feature: Your amazing feature name\n" +
                "  Scenario: Action - An action\n" +
                `    Given I visit path "${baseUrl}"\n` +
                `    When within the element with selector "${domSelector}"\n`
        );
    });
});
