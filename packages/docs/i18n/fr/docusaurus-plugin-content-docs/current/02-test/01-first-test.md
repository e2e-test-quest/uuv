# Mon premier test

:::caution
**Pour l'autocompletion** et **l'exécution depuis l'ide** lors de l'écriture de vos tests, lire cette [section](/docs/getting-started/configuration#ide-plugins)
:::

## Ecriture du test
Pour écrire votre premier test, créer à la racine du projet le fichier `uuv/e2e/first-test.feature` avec le contenu suivant :
```gherkin title='uuv/e2e/first-test.feature' showLineNumbers
Feature: Hello World

  Scenario: Search - Successful case
    When I visit path "https://e2e-test-quest.github.io/weather-app/"
    Then I should see a title named "Welcome to Weather App"
```
Vous pouvez trouver d'autres exemples de test ici :
- [weather-app.feature](https://github.com/e2e-test-quest/uuv/blob/main/example/weather-app.feature)
- [Kata E2E UUV](https://github.com/e2e-test-quest/kata-e2e-uuv/) : une serie d'exercices pour apprendre à écrire des scénarios
