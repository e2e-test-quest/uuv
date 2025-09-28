Feature: UUV Assistant vital features

 Scenario: Bar should be displayed
  When I visit path "/"
  Then I should see an image named "UUV logo"
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
  And I should see a text box named "Generated UUV Script" and containing "Feature: Your amazing feature name Scenario: Action - Expect Given I visit path \"http://localhost:5173/\" Then I should see a text box named \"Last name\" and containing \"Doe\""

 Scenario: Select with mouse expect action - disabled field
  Given I visit path "/"
  When I click on element with role "menuitem" and name "Mouse actions"
  And I click on element with role "menuitem" and name "Expect"
  And I click on element with role "textbox" and name "First name"
  Then I should see a title named "Result of Expect"
  And I should see a text box named "Generated UUV Script" and containing "Feature: Your amazing feature name Scenario: Action - Expect Given I visit path \"http://localhost:5173/\" Then I should see a text box named \"First name\" and containing \"John\" disabled"

 Scenario: Select with mouse click action
  Given I visit path "/"
  When I click on element with role "menuitem" and name "Mouse actions"
  And I click on element with role "menuitem" and name "Click"
  And I click on button named "Reset"
  Then I should see a title named "Result of Click"
  And I should see a text box named "Generated UUV Script" and containing "Feature: Your amazing feature name Scenario: Action - Click Given I visit path \"http://localhost:5173/\" When I click on button named \"Reset\""

 Scenario: Select with mouse within action
  Given I visit path "/"
  When I click on element with role "menuitem" and name "Mouse actions"
  And I click on element with role "menuitem" and name "Within"
  And I click on element with role "group" and name "flegend"
  Then I should see a title named "Result of Within"
  And I should see a text box named "Generated UUV Script" and containing "Feature: Your amazing feature name Scenario: Action - Within Given I visit path \"http://localhost:5173/\" When within a group named \"flegend\""

 Scenario: Select with mouse type action
  Given I visit path "/"
  When I click on element with role "menuitem" and name "Mouse actions"
  And I click on element with role "menuitem" and name "Type"
  And I click on element with role "textbox" and name "Last name"
  Then I should see a title named "Result of Type"
  And I should see a text box named "Generated UUV Script" and containing "Feature: Your amazing feature name Scenario: Action - Type Given I visit path \"http://localhost:5173/\" When I type the sentence \"Doe\" in the text box named \"Last name\""

 Scenario: Select with keyboard navigation action
  Given I visit path "/"
  When I click on element with role "menuitem" and name "Keyboard actions"
  And I click on element with role "menuitem" and name "Keyboard navigation"
  Then I should see a title named "Result of Keyboard Navigation"
# And I should see a radio named "Current"
# And I should see a radio named "Expected"
  And I should see a text box named "Generated UUV Script" and containing "Feature: Your amazing feature name Scenario: Keyboard Navigation Given I visit path \"http://localhost:5173/\" And I start a keyboard navigation from the top of the page Then the next keyboard element focused should be a button named \"Submit\" And the next keyboard element focused should be a slider named \"Range\" And the next keyboard element focused should be a text box named \"Website\" And the next keyboard element focused should be a spin button named \"Power\" And I go to next keyboard element And the element with selector \"input#date\" should be keyboard focused And I go to next keyboard element And the element with selector \"input#time\" should be keyboard focused And the next keyboard element focused should be a text box named \"Last name\" And the next keyboard element focused should be a button named \"anotherButton\" And the next keyboard element focused should be a button named \"firstSubmitButton\" And the next keyboard element focused should be a button named \"secondSubmitButton\" And the next keyboard element focused should be a button named \"Reset\" And I go to next keyboard element And the element with selector \"fieldset[data-testid=fieldset] > details:nth-of-type(1)\" should be keyboard focused And the next keyboard element focused should be a button named \"Table and Grid\" And the next keyboard element focused should be a button named \"Dialog\" And the next keyboard element focused should be a button named \"Close\" And the next keyboard element focused should be a button named \"Cancel\" And the next keyboard element focused should be a button named \"Save changes\" And the next keyboard element focused should be a button named \"Symbole supprimerSupprimer 1\" And the next keyboard element focused should be a button named \"Supprimer 2\""

 Scenario: Form completion should hightlight found form
  Given I visit path "/"
  When I click on element with role "menuitem" and name "Components actions"
  And I click on element with role "menuitem" and name "Form completion (mouse)"
  Then I should see an element with selector "#element-border-0"

 Scenario: Form completion should return result for selected form
  Given I visit path "/"
  When I click on element with role "menuitem" and name "Components actions"
  And I click on element with role "menuitem" and name "Form completion (mouse)"
  And within the element with selector "#element-border-0"
  And I click
  And I reset context
  Then I should see a title named "Result of Form Mouse Completion"
  And I should see a text box named "Generated UUV Script" and containing "Feature: Your amazing feature name Scenario: Action - Form Mouse Completion Given I visit path \"http://localhost:5173/\" When I enter the value \"0\" in the slider named \"Range\" And I type the sentence \"Lorem ipsum\" in the text box named \"Website\" And I enter the value \"123\" in the spin button named \"Power\" And within the element with selector \"input#date\" And I type the sentence \"30/07/2024\" And I reset context And within the element with selector \"input#time\" And I type the sentence \"14:03\" And I reset context And I type the sentence \"Doe\" in the text box named \"Last name\" And I click on button named \"firstSubmitButton\""

 Scenario: Table and grid should hightlight found items
  Given I visit path "/"
  When I click on menuitem named "Components actions"
  And I click on menuitem named "Table and Grid Expect"
  Then I should see an element with selector "#element-border-0"
  And I should see an element with selector "#element-border-1"
  And I should see an element with selector "#element-border-2"
  And I should see an element with selector "#element-border-3"

 Scenario: Table and grid Expect should return result for selected table
  Given I visit path "/"
  When I click on menuitem named "Components actions"
  And I click on menuitem named "Table and Grid Expect"
  And within the element with selector "#element-border-0"
  And I click
  And I reset context
  Then I should see a title named "Result of Table and Grid Expect"
  And I should see a text box named "Generated UUV Script" and containing "Feature: Your amazing feature name Scenario: Action - Table and Grid Expect Given I visit path \"http://localhost:5173/\" Then I should see a table named \"HTML Table Example\" and containing | Company | Contact | Country | | ---------------------------- | ---------------- | ------- | | Alfreds Futterkiste | Maria Anders | Germany | | Centro comercial Moctezuma | Francisco Chang | Mexico | | Ernst Handel | Roland Mendel | Austria | | Island Trading | Helen Bennett | UK | | Laughing Bacchus Winecellars | Yoshi Tannamuri | Canada | | Magazzini Alimentari Riuniti | Giovanni Rovelli | Italy |"

 Scenario: Table and grid Expect should return result for selected grid
  Given I visit path "/"
  And within the element with selector "summary"
  And I click
  And I reset context
  When I click on menuitem named "Components actions"
  And I click on menuitem named "Table and Grid Expect"
  And within the element with selector "#element-border-2"
  And I click
  And I reset context
  Then I should see a title named "Result of Table and Grid Expect"
  And I should see a text box named "Generated UUV Script" and containing "Feature: Your amazing feature name Scenario: Action - Table and Grid Expect Given I visit path \"http://localhost:5173/\" Then I should see a grid named \"Grid Example\" and containing | Company | Contact | Country | | -------------------------- | --------------- | ------- | | Alfreds Futterkiste | Maria Anders | Germany | | Centro comercial Moctezuma | Francisco Chang | Mexico |"

 Scenario: Table and grid Expect should return result for selected treegrid
  Given I visit path "/"
  And within the element with selector "summary"
  And I click
  And I reset context
  When I click on menuitem named "Components actions"
  And I click on menuitem named "Table and Grid Expect"
  And within the element with selector "#element-border-3"
  And I click
  And I reset context
  Then I should see a title named "Result of Table and Grid Expect"
  And I should see a text box named "Generated UUV Script" and containing "Feature: Your amazing feature name Scenario: Action - Table and Grid Expect Given I visit path \"http://localhost:5173/\" Then I should see a treegrid named \"Tree Grid Example\" and containing | Company | Contact | Country | | -------------------------- | --------------- | --------- | | Alfreds Futterkiste | Maria Anders | Germany | | → Subdivision A | Hans Müller | Berlin | | → Subdivision B | Anna Schmidt | Hamburg | | Centro comercial Moctezuma | Francisco Chang | Mexico | | → Team Alpha | Luis González | Monterrey |"

 Scenario: Table and grid Expect should return result for selected aggrid
  Given I visit path "/"
  And within the element with selector "summary"
  And I click
  And I reset context
  When I click on menuitem named "Components actions"
  And I click on menuitem named "Table and Grid Expect"
  And within the element with selector "#element-border-4"
  And I click
  And I reset context
  Then I should see a title named "Result of Table and Grid Expect"
  And I should see a text box named "Generated UUV Script" and containing "Feature: Your amazing feature name Scenario: Action - Table and Grid Expect Given I visit path \"http://localhost:5173/\" Then I should see a grid named \"AG Grid Example\" and containing | Make | Model | Price | Electric | | ---------------- | ---------------- | ---------------- | --------- | | Open Filter Menu | Open Filter Menu | Open Filter Menu | | | Tesla | Model Y | 64950 | checked | | Ford | F-Series | 33850 | unchecked | | Toyota | Corolla | 29600 | unchecked | | Mercedes | EQA | 48890 | checked | | Fiat | 500 | 15774 | unchecked | | Nissan | Juke | 20675 | unchecked |"