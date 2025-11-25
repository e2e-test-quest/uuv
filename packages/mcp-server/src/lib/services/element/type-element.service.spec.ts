import { TypeElementService } from "./type-element.service";

describe("TypeElementService", () => {
    it("should generate script for accessible name and role", () => {
        const baseUrl = "http://example.com";
        const accessibleName = "Hello world";
        const accessibleRole = "button";

        const result = new TypeElementService().generateTestForElement({ baseUrl, accessibleName, accessibleRole });

        expect(result).toEqual(
            "Feature: Your amazing feature name\n" +
                "  Scenario: Action - An action\n" +
                `    Given I visit path "${baseUrl}"\n` +
                `    When I enter the value "Lorem ipsum" in the ${accessibleRole} named "${accessibleName}"\n`
        );
    });

    it("should generate script for domSelector", () => {
        const baseUrl = "http://example.com";
        const domSelector = ".fakeClass";

        expect(() => {
            new TypeElementService().generateTestForElement({
                baseUrl,
                domSelector,
            });
        }).toThrow("Not implemented yet");
    });
});
