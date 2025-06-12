Feature: Using relative url

  # UUV_BASE_URL must be set to "https://e2e-test-quest.github.io"
  Scenario: Should land on weather app homepage
    When I visit path "/weather-app/"
    Then I should see a title named "Welcome to Weather App"
    And I should see a button named "Get started"

  Scenario: grid
    When I visit path "https://ag-grid.com/examples/configuration/column-object/reactFunctional/example-runner/"
    And I set timeout with value 30000
    Then I should see a grid named "" and containing
      | Make  | Model | Price |
      | Toyota   | Celica | 35000 |
      | Ford   | Mondeo | 32000 |
      | Porsche   | Boxster | 72000 |
      | BMW   | M50 | 60000 |
      | Aston Martin   | DBX | 190000 |