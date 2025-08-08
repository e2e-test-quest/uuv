#language: fr
Fonctionnalité: Tableau et grille

  Scénario: key.then.grid.withNameAndContent
    Quand je visite l'Url "https://e2e-test-quest.github.io/simple-webapp/grid.html"
    Alors je dois voir une grille nommée "HTML Grid Example" et contenant
      | Make         | Model   | Price  |
      | ------------ | ------- | ------ |
      | Toyota       | Celica  | 35000  |
      | Ford         | Mondeo  | 32000  |
      | Porsche      | Boxster | 72000  |
      | BMW          | M50     | 60000  |
      | Aston Martin | DBX     | 190000 |

  Scénario: key.then.treegrid.withNameAndContent
    Quand je visite l'Url "https://e2e-test-quest.github.io/simple-webapp/treegrid.html"
    Alors je dois voir une grille arborescente nommée "HTML Treegrid Example" et contenant
      | Make         | Model   | Price  |
      | ------------ | ------- | ------ |
      | Toyota       | Celica  | 35000  |
      | Ford         | Mondeo  | 32000  |
      | Porsche      | Boxster | 72000  |
      | BMW          | M50     | 60000  |
      | Aston Martin | DBX     | 190000 |

  Scénario: key.then.table.withNameAndContent
    Quand je visite l'Url "https://e2e-test-quest.github.io/simple-webapp/table.html"
    Alors je dois voir un tableau nommé "HTML Table Example" et contenant
      | Company                      | Contact          | Country |
      | ----------------------------- | ---------------- | ------- |
      | Alfreds Futterkiste          | Maria Anders     | Germany |
      | Centro comercial Moctezuma   | Francisco Chang  | Mexico  |
      | Ernst Handel                 | Roland Mendel    | Austria |
      | Island Trading               | Helen Bennett    | UK      |
      | Laughing Bacchus Winecellars | Yoshi Tannamuri  | Canada  |
      | Magazzini Alimentari Riuniti | Giovanni Rovelli | Italy   |

  Scénario: key.then.aggrid.withNameAndContent
    Quand je visite l'Url "https://e2e-test-quest.github.io/simple-webapp/aggrid.html"
    Alors je dois voir une grille nommée "AG Grid Example" et contenant
      | Make             | Model            | Price            | Electric         |
      | ---------------- | ---------------- | ---------------- | ---------------- |
      | Open Filter Menu | Open Filter Menu | Open Filter Menu | Open Filter Menu |
      | Tesla            | Model Y          | 64950            | checked          |
      | Ford             | F-Series         | 33850            | unchecked        |
      | Toyota           | Corolla          | 29600            | unchecked        |
      | Mercedes         | EQA              | 48890            | checked          |
      | Fiat             | 500              | 15774            | unchecked        |
      | Nissan           | Juke             | 20675            | unchecked        |
