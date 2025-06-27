Feature: Using relative url

  # UUV_BASE_URL must be set to "https://e2e-test-quest.github.io"
  Scenario: Should land on weather app homepage
    When I visit path "/weather-app/"
    Then I should see a title named "Welcome to Weather App"
    And I should see a button named "Get started"