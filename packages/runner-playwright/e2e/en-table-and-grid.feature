Feature: Table and grid

  Scenario: key.then.grid.withNameAndContent
    When I visit path "https://e2e-test-quest.github.io/simple-webapp/grid.html"
    Then I should see a grid named "HTML Grid Example" and containing
      | Make         | Model   | Price  |
      | ------------ | ------- | ------ |
      | Toyota       | Celica  | 35000  |
      | Ford         | Mondeo  | 32000  |
      | Porsche      | Boxster | 72000  |
      | BMW          | M50     | 60000  |
      | Aston Martin | DBX     | 190000 |

  Scenario: key.then.treegrid.withNameAndContent
    When I visit path "https://e2e-test-quest.github.io/simple-webapp/treegrid.html"
    Then I should see a treegrid named "HTML Treegrid Example" and containing
      | Make         | Model   | Price  |
      | ------------ | ------- | ------ |
      | Toyota       | Celica  | 35000  |
      | Ford         | Mondeo  | 32000  |
      | Porsche      | Boxster | 72000  |
      | BMW          | M50     | 60000  |
      | Aston Martin | DBX     | 190000 |

  Scenario: key.then.table.withNameAndContent
    When I visit path "https://e2e-test-quest.github.io/simple-webapp/table.html"
    Then I should see a table named "HTML Table Example" and containing
      | Company                       | Contact          | Country |
      | ----------------------------- | ---------------- | ------- |
      | Alfreds Futterkiste           | Maria Anders     | Germany |
      | Centro comercial Moctezuma    | Francisco Chang  | Mexico  |
      | Ernst Handel                  | Roland Mendel    | Austria |
      | Island Trading                | Helen Bennett    | UK      |
      | Laughing Bacchus Winecellars  | Yoshi Tannamuri  | Canada  |
      | Magazzini Alimentari Riuniti  | Giovanni Rovelli | Italy   |

  Scenario: key.then.aggrid.withNameAndContent
    When I visit path "https://e2e-test-quest.github.io/simple-webapp/aggrid.html"
    Then I should see a grid named "AG Grid Example" and containing
      | Make             | Model            | Price            | Electric         |
      | ---------------- | ---------------- | ---------------- | ---------------- |
      | Open Filter Menu | Open Filter Menu | Open Filter Menu | Open Filter Menu |
      | Tesla            | Model Y          | 64950            | checked          |
      | Ford             | F-Series         | 33850            | unchecked        |
      | Toyota           | Corolla          | 29600            | unchecked        |
      | Mercedes         | EQA              | 48890            | checked          |
      | Fiat             | 500              | 15774            | unchecked        |
      | Nissan           | Juke             | 20675            | unchecked        |

  Scenario: key.then.aggrid-edit.withNameAndContent
    Given I visit path "https://e2e-test-quest.github.io/simple-webapp/aggrid.html"
    And I should see a grid named "Editable AG Grid Example" and containing
      | Make             | Model            | Price            | Electric                                     |
      | ---------------- | ---------------- | ---------------- | ----------------                             |
      | Open Filter Menu | Open Filter Menu | Open Filter Menu | Open Filter Menu                              |
      | Tesla            | Model Y          | 64950            | Press SPACE to toggle cell value (checked)   |
      | Ford             | F-Series         | 33850            | Press SPACE to toggle cell value (unchecked) |
      | Toyota           | Corolla          | 29600            | Press SPACE to toggle cell value (unchecked) |
      | Mercedes         | EQA              | 48890            | Press SPACE to toggle cell value (checked)   |
      | Fiat             | 500              | 15774            | Press SPACE to toggle cell value (unchecked) |
      | Nissan           | Juke             | 20675            | Press SPACE to toggle cell value (unchecked) |
    When within a grid named "Editable AG Grid Example"
     And I type the sentence "Toto" in aggrid cell at the row 2 and column named "Make"
     And I reset context
    Then I should see a grid named "Editable AG Grid Example" and containing
      | Make             | Model            | Price            | Electric                                     |
      | ---------------- | ---------------- | ---------------- | ----------------                             |
      | Open Filter Menu | Open Filter Menu | Open Filter Menu | Open Filter Menu                             |
      | Toto             | Model Y          | 64950            | Press SPACE to toggle cell value (checked)   |
      | Ford             | F-Series         | 33850            | Press SPACE to toggle cell value (unchecked) |
      | Toyota           | Corolla          | 29600            | Press SPACE to toggle cell value (unchecked) |
      | Mercedes         | EQA              | 48890            | Press SPACE to toggle cell value (checked)   |
      | Fiat             | 500              | 15774            | Press SPACE to toggle cell value (unchecked) |
      | Nissan           | Juke             | 20675            | Press SPACE to toggle cell value (unchecked) |