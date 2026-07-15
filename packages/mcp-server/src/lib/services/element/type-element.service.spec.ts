import { TypeElementService } from "./type-element.service";

describe("TypeElementService", () => {
    it("should generate script for accessible name and a textbox", () => {
        const baseUrl = "http://example.com";
        const accessibleName = "Hello world";
        const accessibleRole = "textbox";

        const result = new TypeElementService().generateTestForElement({ baseUrl, accessibleName, accessibleRole });

        expect(result).toEqual(
            "Feature: Your amazing feature name\n" +
                "  Scenario: Action - Type into field\n" +
                `    Given I visit path "${baseUrl}"\n` +
                `    When I type the sentence "Lorem ipsum" in the text box named "${accessibleName}"\n`
        );
    });
    it("should generate script for accessible name and a spinbutton", () => {
        const baseUrl = "http://example.com";
        const accessibleName = "Duration";
        const accessibleRole = "spinbutton";
        const input = { baseUrl, accessibleName, accessibleRole, valueToType: "1.5" };

        const result = new TypeElementService().generateTestForElement(input);

        expect(result).toEqual(
            "Feature: Your amazing feature name\n" +
                "  Scenario: Action - Type into field\n" +
                `    Given I visit path "${baseUrl}"\n` +
                `    When I enter the value "${input.valueToType}" in the spin button named "${accessibleName}"\n`
        );
    });

    it("should generate script for accessible name and a combobox", () => {
        const baseUrl = "http://example.com";
        const accessibleName = "Town type";
        const accessibleRole = "combobox";
        const input = { baseUrl, accessibleName, accessibleRole, valueToType: "Real" };

        const result = new TypeElementService().generateTestForElement(input);

        expect(result).toEqual(
            "Feature: Your amazing feature name\n" +
                "  Scenario: Action - Type into field\n" +
                `    Given I visit path "${baseUrl}"\n` +
                `    When I select the value "${input.valueToType}" in the combo box named "${accessibleName}"\n`
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
