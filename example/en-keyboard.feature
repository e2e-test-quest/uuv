Feature: Keyboard Navigation
  Scenario: Google homepage navigation
    Given I visit path "https://www.google.fr/"
    When I start a keyboard navigation from the top of the page
    Then the next keyboard element focused should be a link named "Gmail"
    And the next keyboard element focused should be a link named "Rechercher des images"
    And the next keyboard element focused should be a button named "Applications Google"

  Scenario: Focus on Get Started button
    Given I visit path "https://e2e-test-quest.github.io/weather-app/"
    When I start a keyboard navigation from the top of the page
    Then the next keyboard element focused should be a link named "Weather App's Logo"
    And the next keyboard element focused should be a link named "Home"
    And the next keyboard element focused should be a button named "Get started"

  Scenario: Verify new town form keyboard navigation
    Given I visit path "https://e2e-test-quest.github.io/weather-app/?isStarted=true"
    When I click on button named "Add new town"
    And I start a keyboard navigation from the top of the page
    Then the next keyboard element focused should be a link named "Weather App's Logo"
    And the next keyboard element focused should be a link named "Home"
    And the next keyboard element focused should be a text box named "Town name"
    And the next keyboard element focused should be a spin button named "Latitude"
    And the next keyboard element focused should be a spin button named "Longitude"
    And the next keyboard element focused should be a text box named "Description"
    And the next keyboard element focused should be a button named "Back to town list"
    And the next keyboard element focused should be a button named "Submit new town form"

  Scenario: Fill new town form with keyboard
    Given I visit path "https://e2e-test-quest.github.io/weather-app/?isStarted=true"
    And I mock a request GET on url "https://e2e-test-quest.github.io/weather-app/data/mock.json" named "mock-new-town" with fixture mock-new-town.json
    And I mock a request POST on url "https://e2e-test-quest.github.io/weather-app/api" named "mock-post-new-town" with content "Success"

    When I click on button named "Add new town"
    And I start a keyboard navigation from the top of the page
    And the next keyboard element focused should be a link named "Weather App's Logo"
    And the next keyboard element focused should be a link named "Home"

    And the next keyboard element focused should be a text box named "Town name"
    And I type the sentence "Paris"

    And the next keyboard element focused should be a spin button named "Latitude"
    And I type the sentence "10"

    And the next keyboard element focused should be a spin button named "Longitude"
    And I type the sentence "123"

    And the next keyboard element focused should be a text box named "Description"
    And I type the sentence "Simple Description"

    And the next keyboard element focused should be a button named "Back to town list"

    And the next keyboard element focused should be a button named "Submit new town form"

    And I click

    Then I should see a list named "Available Towns" and containing
      | Douala  |
      | Tunis   |
      | Limoges |
      | Paris   |
