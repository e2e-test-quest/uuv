Feature: Bugs resolved

  Scenario: Bug 1214
    Given I set timeout with value 10000
    When I visit path "https://www.ag-grid.com/examples/getting-started/quick-start-example/typescript/example-runner"
    Then I should see a column header named "Make"
    And I should see a column header named "Model"
    And I should see a column header named "Price"
    And I should see a column header named "Electric"