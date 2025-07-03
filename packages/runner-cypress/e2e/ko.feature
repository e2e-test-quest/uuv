Feature: Ko

  @ko
  Scenario: Homepage - Bad title
    Given I visit path "https://e2e-test-quest.github.io/weather-app/"
    # Verify elements on landing page
    Then I should see a title named "Welcome to Weather App - ko"
    And I should see a button named "Get started"

  Scenario: Weather - Town List must be ok
    Given I visit path "https://e2e-test-quest.github.io/weather-app/"
    # Click on <Get started> button
    When I click on button named "Get started"
    # Checks the list of available towns.
    Then I should see a list named "Available Towns" and containing
      | Douala  |
      | Tunis   |
      | Limoges |

  @ko
  Scenario: TownResearch - Bad textbox name
    Given I visit path "https://e2e-test-quest.github.io/weather-app/"
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
    Given I visit path "https://e2e-test-quest.github.io/weather-app/"
    Then I should consume a mock named "uuvFixture"

  @ko
  Scenario: Radio button - Ko unchecked
    Given I visit path "https://e2e-test-quest.github.io/weather-app/"
    Then I should see a radio named "Small (under 150000)" unchecked

  @ko
  Scenario: Radio button - Ko checked
    Given I visit path "https://e2e-test-quest.github.io/weather-app/"
    Then I should see a radio named "Medium (150000 to 1 million)" checked

  @ko
  Scenario: Checkbox - Ko unchecked
    Given I visit path "https://e2e-test-quest.github.io/weather-app/"
    Then I should see a checkbox named "Allow automatic update" checked

  @ko
  Scenario: Checkbox - Ko checked
    Given I visit path "https://e2e-test-quest.github.io/weather-app/"
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

  @ko
  Scenario: Table content should failed when wrong content
    When I visit path "https://e2e-test-quest.github.io/simple-webapp/table.html"
    Then I should see a table named "HTML Table Example" and containing
      | Company                       | Contact          | Country |
      | ----------------------------- | ---------------- | ------- |
      | Alfreds Futterkiste           | Maria Anders     | Germany |
      | Centro comercial Moctezuma    | Etienne Daaho    | Mexico  |
      | Ernst Handel                  | Roland Mendel    | Austria |
      | Island Trading                | Helen Bennett    | UK      |
      | Laughing Bacchus Winecellars  | Yoshi Tannamuri  | Canada  |
      | Magazzini Alimentari Riuniti  | Giovanni Rovelli | Italy   |

  @ko
  Scenario: Title should failed when bad level
    When I visit path "https://e2e-test-quest.github.io/simple-webapp/grid.html"
    Then I should see a title named "HTML Grid Example" with level 2
