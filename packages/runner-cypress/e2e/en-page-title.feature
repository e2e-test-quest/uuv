Feature: Page title

  Scenario: key.then.grid.withNameAndContent
    When I visit path "https://e2e-test-quest.github.io/simple-webapp/grid.html"
    Then I should see the page title "HTML Grid"

  Scenario: key.then.grid.withNameAndContent multiple
    When I visit path "https://e2e-test-quest.github.io/simple-webapp/grid.html"
    Then I should see the page title "HTML Grid"
    When I visit path "https://e2e-test-quest.github.io/simple-webapp/table.html"
    Then I should see the page title "HTML Table"