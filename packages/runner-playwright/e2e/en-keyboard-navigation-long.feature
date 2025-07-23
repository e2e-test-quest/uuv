Feature: Keyboard Navigation - Long

  Scenario: Focus on app logo
    Given I visit path "https://e2e-test-quest.github.io/weather-app/"
    When I start a keyboard navigation from the top of the page
    Then I go to next keyboard element
    And the element with role "link" and name "Weather App's Logo" should be keyboard focused
    And I should see a link named "Weather App's Logo" keyboard focused

  Scenario: Focus on app link
    Given I visit path "https://e2e-test-quest.github.io/weather-app/"
    And I start a keyboard navigation from the top of the page
    When I go to next keyboard element
    And I go to next keyboard element
    Then the element with role "link" and name "Home" should be keyboard focused
    And I should see a link named "Home" keyboard focused

  Scenario: Focus on app link with back nav
    Given I visit path "https://e2e-test-quest.github.io/weather-app/"
    When I start a keyboard navigation from the top of the page
    Then I go to next keyboard element
    And I should see a link named "Weather App's Logo" keyboard focused
    And I go to next keyboard element
    And I should see a link named "Home" keyboard focused
    And I go to next keyboard element
    And I should see a button named "Get started" keyboard focused
    And I go to previous keyboard element
    And the element with role "link" and name "Home" should be keyboard focused
    And I should see a link named "Home" keyboard focused

  Scenario: Focus on Get Started button
    Given I visit path "https://e2e-test-quest.github.io/weather-app/"
    When I start a keyboard navigation from the top of the page
    And I go to next keyboard element
    And I should see a link named "Weather App's Logo" keyboard focused
    And I go to next keyboard element
    And I should see a link named "Home" keyboard focused
    And I go to next keyboard element
    Then I should see a button named "Get started" keyboard focused

  Scenario: Verify new town form keyboard navigation
    Given I visit path "https://e2e-test-quest.github.io/weather-app/?isStarted=true"
    When I click on button named "Add new town"
    And I start a keyboard navigation from the top of the page
    And I go to next keyboard element

    And I should see a link named "Weather App's Logo" keyboard focused
    And I go to next keyboard element

    And I should see a link named "Home" keyboard focused
    And I go to next keyboard element

    Then I should see a text box named "Town name" keyboard focused
    And I go to next keyboard element

    And I should see a combo box named "Town type" keyboard focused
    And I go to next keyboard element

    And I should see a spin button named "Latitude" keyboard focused
    And I go to next keyboard element

    And I should see a spin button named "Longitude" keyboard focused
    And I go to next keyboard element

    And I should see a text box named "Description" keyboard focused
    And I go to next keyboard element

    And I should see a radio named "Small (under 150000)" keyboard focused
    And I go to next keyboard element

    And I should see a checkbox named "Allow automatic update" keyboard focused
    And I go to next keyboard element

    And I should see a button named "Back to town list" keyboard focused
    And I go to next keyboard element

    And I should see a button named "Submit new town form" keyboard focused

  Scenario: Fill new town form with keyboard
    Given I visit path "https://e2e-test-quest.github.io/weather-app/?isStarted=true"
    And I mock a request GET on url "https://e2e-test-quest.github.io/weather-app/data/mock.json" named "mock-new-town" with fixture mock-new-town.json
    And I mock a request POST on url "https://e2e-test-quest.github.io/weather-app/api" named "mock-post-new-town" with content "Success"

    When I click on button named "Add new town"
    And I start a keyboard navigation from the top of the page
    And I go to next keyboard element
    And I should see a link named "Weather App's Logo" keyboard focused
    And I go to next keyboard element
    And I should see a link named "Home" keyboard focused
    And I go to next keyboard element

    And I should see a text box named "Town name" keyboard focused
    And I type the sentence "Paris"
    And I go to next keyboard element

    And I should see a combo box named "Town type"
    And I select the value "Real"
    And I go to next keyboard element

    And I should see a spin button named "Latitude" keyboard focused
    And I enter the value "10"
    And I go to next keyboard element

    And I should see a spin button named "Longitude" keyboard focused
    And I type the sentence "123"
    And I go to next keyboard element

    And the element with selector "#new-town-description" should be keyboard focused
    And I type the sentence "Simple Description"
    And I go to next keyboard element

    And I go to next keyboard element
    And I go to next keyboard element

    And I should see a button named "Back to town list" keyboard focused
    And I go to next keyboard element
    And I should see a button named "Submit new town form" keyboard focused
    And I click

    Then I should see a list named "Available Towns" and containing
      | Douala  |
      | Tunis   |
      | Limoges |
      | Paris   |
