Feature: UUV Assistant vital features

  Scenario: Bar should be displayed
 When I visit path "/"
 Then I should see a picture named "UUV logo"
 And I should see a menuitem named "Mouse actions"
 And I should see a menuitem named "Keyboard actions"
 And I should see a button named "Open result view"
 And I should not see a title named "Result of No action"

  Scenario: Available mouse actions
 Given I visit path "/"
 When I click on element with role "menuitem" and name "Mouse actions"
 Then I should see a menuitem named "Expect"
 And I should see a menuitem named "Click"
 And I should see a menuitem named "Within"

  Scenario: Available keyboard actions
 Given I visit path "/"
 When I click on element with role "menuitem" and name "Keyboard actions"
 And I should see a menuitem named "Keyboard navigation"

  Scenario: Opening result view without result
 Given I visit path "/"
 When I click on button named "Open result view"
 Then I should see a title named "Result of No action"
 And I should see a text box named "Generated UUV Script" and containing ""

  Scenario: Select with mouse expect action
 Given I visit path "/"
 When I click on element with role "menuitem" and name "Mouse actions"
 And I click on element with role "menuitem" and name "Expect"
 And I click on element with role "textbox" and name "Last name"
 Then I should see a title named "Result of Expect"
 And I should see a text box named "Generated UUV Script" and containing "Feature: Your amazing feature name Scenario: Action - Expect Given I visit path \"http://127.0.0.1:3200/\" Then I should see a text box named \"Last name\" and containing \"Doe\""

  Scenario: Select with mouse expect action - disabled field
 Given I visit path "/"
 When I click on element with role "menuitem" and name "Mouse actions"
 And I click on element with role "menuitem" and name "Expect"
 And I click on element with role "textbox" and name "First name"
 Then I should see a title named "Result of Expect"
 And I should see a text box named "Generated UUV Script" and containing "Feature: Your amazing feature name Scenario: Action - Expect Given I visit path \"http://127.0.0.1:3200/\" Then I should see a text box named \"First name\" and containing \"John\" disabled"

  Scenario: Select with mouse click action
 Given I visit path "/"
 When I click on element with role "menuitem" and name "Mouse actions"
 And I click on element with role "menuitem" and name "Click"
 And I click on button named "Reset"
 Then I should see a title named "Result of Click"
 And I should see a text box named "Generated UUV Script" and containing "Feature: Your amazing feature name Scenario: Action - Click Given I visit path \"http://127.0.0.1:3200/\" When I click on button named \"Reset\""

  Scenario: Select with mouse within action
 Given I visit path "/"
 When I click on element with role "menuitem" and name "Mouse actions"
 And I click on element with role "menuitem" and name "Within"
 And I click on element with role "group" and name "flegend"
 Then I should see a title named "Result of Within"
 And I should see a text box named "Generated UUV Script" and containing "Feature: Your amazing feature name Scenario: Action - Within Given I visit path \"http://127.0.0.1:3200/\" When within a group named \"flegend\""

  Scenario: Select with keyboard navigation action
 Given I visit path "/"
 When I click on element with role "menuitem" and name "Keyboard actions"
 And I click on element with role "menuitem" and name "Keyboard navigation"
 Then I should see a title named "Result of Keyboard Navigation"
# And I should see a radio named "Current"
# And I should see a radio named "Expected"
 And I should see a text box named "Generated UUV Script" and containing "Feature: Your amazing feature name Scenario: Keyboard Navigation Given I visit path \"http://127.0.0.1:3200/\" And I start a keyboard navigation from the top of the page Then the next keyboard element focused should be a slider named \"Range\" And the next keyboard element focused should be a text box named \"Website\" And the next keyboard element focused should be a spin button named \"Power\" And I go to next keyboard element And the element with selector \"input#date\" should be keyboard focused And I go to next keyboard element And the element with selector \"input#time\" should be keyboard focused And the next keyboard element focused should be a text box named \"Last name\" And the next keyboard element focused should be a button named \"anotherButton\" And the next keyboard element focused should be a button named \"firstSubmitButton\" And the next keyboard element focused should be a button named \"secondSubmitButton\" And the next keyboard element focused should be a button named \"Reset\" And the next keyboard element focused should be a button named \"Submit\""

  Scenario: Form completion should hightlight found form
 Given I visit path "/"
 When I click on element with role "menuitem" and name "Form actions"
 And I click on element with role "menuitem" and name "Form completion with mouse"
 Then I should see an element with selector "#element-border-0"

  Scenario: Form completion should return result for selected form
 Given I visit path "/"
 When I click on element with role "menuitem" and name "Form actions"
 And I click on element with role "menuitem" and name "Form completion with mouse"
 And within the element with selector "#element-border-0"
 And I click
 And I reset context
 Then I should see a title named "Result of Form Mouse Completion"
 And I should see a text box named "Generated UUV Script" and containing "Feature: Your amazing feature name  Scenario: Action - Form Mouse Completion Given I visit path \"http://localhost:3200/\" When I enter the value \"10\" in the slider named \"Range\" And I type the sentence \"Lorem ipsum\" in the text box named \"Website\" And I enter the value \"123\" in the spin button named \"Power\" And within the element with selector \"input#date\" And I type the sentence \"30/07/2024\" And I reset context And within the element with selector \"input#time\" And I type the sentence \"14:03\" And I reset context And I type the sentence \"Doe\" in the text box named \"Last name\" And I click on button named \"firstSubmitButton\""
