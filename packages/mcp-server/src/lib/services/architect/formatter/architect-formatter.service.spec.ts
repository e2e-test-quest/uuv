import { ArchitectFormatterService } from "./architect-formatter.service";
import { ScenarioResult } from "../architect.model";

describe("ArchitectFormatterService", () => {
    it("should format generate scenario into gherkin step", () => {
        const service = new ArchitectFormatterService();
        const scenarioResult: ScenarioResult = {
            scenarioTitle: "Add New Town: New York",
            givenSteps: [
                {
                    "stepNumber": 0,
                    "action": "navigation",
                    "targetElement": null,
                    "valueToType": null,
                    "valueToSelect": null,
                    "targetUrl": "https://e2e-test-quest.github.io/weather-app/",
                    "stepComment": "Navigates to the Weather App landing page."
                }
            ],
            whenSteps: [
                {
                    "stepNumber": 1,
                    "action": "click",
                    "targetElement": {
                        "accessibleName": "Get started",
                        "accessibleRole": "button",
                        "value": null
                    },
                    "valueToType": null,
                    "valueToSelect": null,
                    "targetUrl": null,
                    "stepComment": "Cicks 'Get started' button to proceed with onboarding."
                },
                {
                    "stepNumber": 2,
                    "action": "click",
                    "targetElement": {
                        "accessibleName": "Add new town",
                        "accessibleRole": "button",
                        "value": null
                    },
                    "valueToType": null,
                    "valueToSelect": null,
                    "targetUrl": null,
                    "stepComment": "Clicks 'Add new town' button to access the form."
                },
                {
                    "stepNumber": 3,
                    "action": "type",
                    "targetElement": {
                        "accessibleName": "Town name",
                        "accessibleRole": "textbox",
                        "value": null
                    },
                    "valueToType": "New-York",
                    "valueToSelect": null,
                    "targetUrl": null,
                    "stepComment": "Inputs 'New-York' into the Town name field."
                },
                {
                    "stepNumber": 4,
                    "action": "select",
                    "targetElement": {
                        "accessibleName": "Town type",
                        "accessibleRole": "combobox",
                        "value": null
                    },
                    "valueToType": null,
                    "valueToSelect": "Real",
                    "targetUrl": null,
                    "stepComment": "Selects 'Real' from the Town type dropdown."
                },
                {
                    "stepNumber": 5,
                    "action": "type",
                    "targetElement": {
                        "accessibleName": "Latitude",
                        "accessibleRole": "spinbutton",
                        "value": null
                    },
                    "valueToType": "40.73",
                    "valueToSelect": null,
                    "targetUrl": null,
                    "stepComment": "Inputs the latitude (40.73) for New-York."
                },
                {
                    "stepNumber": 6,
                    "action": "type",
                    "targetElement": {
                        "accessibleName": "Longitude",
                        "accessibleRole": "spinbutton",
                        "value": null
                    },
                    "valueToType": "74.00",
                    "valueToSelect": null,
                    "targetUrl": null,
                    "stepComment": "Inputs the longitude (74.00) for New-York."
                },
                {
                    "stepNumber": 7,
                    "action": "type",
                    "targetElement": {
                        "accessibleName": "Description",
                        "accessibleRole": "textbox",
                        "value": null
                    },
                    "valueToType": "New York City",
                    "valueToSelect": null,
                    "targetUrl": null,
                    "stepComment": "Inputs 'New York City' as the description."
                },
                {
                    "stepNumber": 8,
                    "action": "click",
                    "targetElement": {
                        "accessibleName": "Submit new town form",
                        "accessibleRole": "button",
                        "value": null
                    },
                    "valueToType": null,
                    "valueToSelect": null,
                    "targetUrl": null,
                    "stepComment": "Clicks 'Submit new town form' button to submit the newly created town data."
                }
            ],
            thenSteps: [
                {
                    "stepNumber": 10,
                    "action": "stop",
                    "targetElement": null,
                    "valueToType": null,
                    "valueToSelect": null,
                    "targetUrl": null,
                    "stepComment": "Test concludes after attempting to submit the form."
                }
            ]
        };
        expect(service.formatScenario(scenarioResult)).toEqual(`
  Scenario: Add New Town: New York
    Given I visit path "https://e2e-test-quest.github.io/weather-app/"
    When I click on button named "Get started"
     And I click on button named "Add new town"
     And I type the sentence "New-York" in the text box named "Town name"
     And I select the value "Real" in the combo box named "Town type"
     And I enter the value "40.73" in the spin button named "Latitude"
     And I enter the value "74.00" in the spin button named "Longitude"
     And I type the sentence "New York City" in the text box named "Description"
     And I click on button named "Submit new town form"
    
  `);
    });
});
