Feature: Ko

  Background:
    Given I visit path "https://e2e-test-quest.github.io/weather-app/"

  @ko
  Scenario: Homepage - Bad title
    # Verify elements on landing page
    Then I should see a title named "Welcome to Weather App - ko"
    And I should see a button named "Get started"

  Scenario: Weather - Town List must be ok
    # Click on <Get started> button
    When I click on button named "Get started"
    # Checks the list of available towns.
    Then I should see a list named "Available Towns" and containing
      | Douala  |
      | Tunis   |
      | Limoges |

  @ko
  Scenario: TownResearch - Bad textbox name
    # Click on <Get started> button
    When I click on button named "Get started"
    # Type sentence "i" on input field
    And I type the sentence "i" in the text box named "Search for a town3"
    # Click on <Filter> button
    And I click on button named "Filter"
    # Checks the list of available towns.
    Then I should see a list named "Available Towns" and containing
      | Tunis   |
      | Limoges |

  @ko
  Scenario: Error when waiting a mock without instanciate a mock before
    Then I should consume a mock named "uuvFixture"

  @ko
  Scenario: Radio button - Ko unchecked
      Then I should see a radio named "Small (under 150000)" unchecked

  @ko
  Scenario: Radio button - Ko checked
      Then I should see a radio named "Medium (150000 to 1 million)" checked

  @ko
  Scenario: Checkbox - Ko unchecked
      Then I should see a checkbox named "Allow automatic update" checked

  @ko
  Scenario: Checkbox - Ko checked
      When I click on element with role "checkbox" and name "Allow automatic update"
      Then I should see a checkbox named "Allow automatic update" unchecked

  @ko
  Scenario: click failed with custom timeout
    Given I visit path "https://e2e-test-quest.github.io/simple-webapp/"
    When I click on button named "Start timer"
    And I set timeout with value 9000
    Then I click on button named "Timer ended"

  @ko
  Scenario: axe core failed
    When I visit path "https://e2e-test-quest.github.io/weather-app/?isStarted=true"
    Then I should not have any axe-core accessibility issue
