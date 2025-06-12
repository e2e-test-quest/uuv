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