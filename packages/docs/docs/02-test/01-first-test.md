# Your first test

:::caution
**For autocompletion** and **execution from ide** while writing your tests, read this [section](/docs/getting-started/configuration#ide-plugins)
:::

## Writing test
To write your first test, create the file `uuv/e2e/first-test.feature` in the project root with the following content :
```gherkin title='uuv/e2e/first-test.feature' showLineNumbers
Feature: Hello World

  Scenario: Search - Successful case
    When I visit path "https://e2e-test-quest.github.io/weather-app/"
    Then I should see a title named "Welcome to Weather App"
```
You can find test examples here :
- [weather-app.feature](https://github.com/e2e-test-quest/uuv/blob/main/example/weather-app.feature)
- [Kata E2E UUV](https://github.com/e2e-test-quest/kata-e2e-uuv/) : a set of exercises to learn how to write scenarios

