Feature: Form field

  Background:
    Given I visit path "https://e2e-test-quest.github.io/weather-app/?isStarted=true"
    And I click on button named "Add new town"

  Scenario: select a value in combo box then check
    When I select the value "Unreal" in the combo box named "Town type"
    Then I should see a combo box named "Town type" with value "Unreal"

  Scenario: Set a input text value then check
    When I enter the value "Azerty" in the text box named "Town name"
    Then I should see a text box named "Town name" with value "Azerty"

  Scenario: Set a input number value then check
    When I enter the value "10" in the spin button named "Latitude"
    Then I should see a spin button named "Latitude" with value "10"