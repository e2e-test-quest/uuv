Feature: Custom Step Definition

  Scenario: Second custom step definition
    When I visit path "https://e2e-test-quest.github.io/weather-app/"
    Then I should see a title named "Welcome to Weather App"
    And My second custom step definition
    And My third custom step definition
