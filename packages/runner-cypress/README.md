
# @uuv/cypress
<p align="center">  
<a href="https://e2e-test-quest.github.io/uuv/">  
<picture>  
<img alt="UUV Logo" src="https://e2e-test-quest.github.io/uuv/img/uuv.png">  
</picture>  
</a>  
</p>  

<h3 align="center">  
Test as final user  
</h3>  

<p align="center">  
A solution to facilitate the writing and execution of E2E tests understandable by any human being(English or French) using cucumber(BDD) and cypress or playwright.
</p>  

<p align="center">  
<a href="https://www.npmjs.com/package/@uuv/cypress" target="_blank">  
<img src="https://img.shields.io/badge/available%20on%20npm-grey?logo=npm" alt="npm"/>  
</a>  
<a href="https://www.cypress.io/" target="_blank">  
<img src="https://img.shields.io/badge/tested with-cypress-04C38E?logo=cypress" alt="cypress"/>  
</a>  
<a href="https://testing-library.com/" target="_blank">  
<img src="https://img.shields.io/badge/tested%20with-testing%20library-ED3B3A?logo=testing-library" alt="testing-library"/>  
</a>  
<a href="https://cucumber.io/" target="_blank">  
<img src="https://img.shields.io/badge/tested%20with-cucumber-1dbb68?logo=cucumber" alt="cucumber"/>  
</a><br />  
</p>

<div align="center">
<a href="https://www.npmjs.com/package/@uuv/cypress" target="_blank">
    <img alt="@uuv/cypress npm library download count"
        src="https://img.shields.io/npm/dt/%40uuv/cypress?logo=npm&label=%40uuv%2Fcypress"></img>
</a>
<a href="https://www.npmjs.com/package/@uuv/playwright" target="_blank">
    <img alt="@uuv/playwright npm library download count"
         src="https://img.shields.io/npm/dt/%40uuv/playwright?logo=npm&label=%40uuv%2Fplaywright"></img>
</a>
<a href="https://www.npmjs.com/package/@uuv/assistant" target="_blank">
    <img alt="@uuv/assistant npm library download count"
         src="https://img.shields.io/npm/dt/%40uuv/assistant?logo=npm&label=%40uuv%2Fassistant"></img>
</a>
<a href="https://www.npmjs.com/package/@uuv/a11y" target="_blank">
    <img alt="@uuv/a11y npm library download count"
         src="https://img.shields.io/npm/dt/%40uuv/a11y?logo=npm&label=%40uuv%2Fa11y"></img>
</a>
<a href="https://plugins.jetbrains.com/plugin/22437-uuv" target="_blank">
    <img alt="JetBrains Plugin Downloads" src="https://img.shields.io/jetbrains/plugin/d/22437-uuv?logo=jetbrains&label=UUV%20plugin"></img>
</a>
<br />
</div>

## What is @uuv/cypress?

<p align="center">  

The `@uuv` library (User centric Usecases Validator) is an ecosystem that simplifies the writing of End to End tests in a BDD approach and a user-centric way.  
We can use the cypress engine(`@uuv/cypress`) to run test or playwright with [@uuv/playwright](https://www.npmjs.com/package/@uuv/playwright)
</p>  

## Benefits
- If used correctly, integrates accessibility from the development stage
- A living documentation is possible because we propose an unified language for developers and non-developers with a [rich dictionary](https://e2e-test-quest.github.io/uuv/docs/category/step-definition) of ready-to-use sentences
- [@uuv/assistant](https://www.npmjs.com/package/@uuv/assistant) that facilitates the writing of tests by suggesting the most accessible sentences
- [JetBrains Plugin](https://e2e-test-quest.github.io/uuv/docs/tools/uuv-jetbrains-plugin) that helps you to write and execute your UUV E2E tests from JetBrains IDEs
- Integrates several runtime engines: Cypress / Playwright
- User friendly and standardized execution report([example](https://e2e-test-quest.github.io/kata-e2e-uuv/
  ### <u>Comparison</u>
| Criteria | Cypress | Playwright | Testing library | UUV |  
|:-: |:-: |:-: |:-: |:-: |  
| User centrism | :x: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  
| Native accessibility | :x: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  
| Easy setup configuration for BDD test | :warning: | :warning: | :heavy_minus_sign: | :heavy_check_mark: |  
| Understandable by everyone <br> (included non dev) | :x: | :x: | :x: | :heavy_check_mark: |  

### <u>Syntax example</u>
With this dom example :
  ```html
  <body>
  <h1>Result<h1>
  </body>
```
we see that the sentence proposed by **UUV is the most understandable** of all
| Library | Syntax |
|:--|:--|
| Cypress  | cy.get('h1').contains('Result') |
| Playwright| await expect(page.getByTitle('Result')).toHaveCount(1) |
| Testing library  | expect(screen.getByTitle(/Result/i)).toBeTruthy() |
| UUV | Then I should see a title named "Result"|


## Documentation
<a href="https://e2e-test-quest.github.io/uuv/"><img src="https://img.shields.io/badge/documentation-black?&style=for-the-badge&logo=github&logoColor=white" alt="documentation"/></a>

## Demonstration

### Demo in english
<a href="https://player.vimeo.com/video/822253247?texttrack=en&h=617306172d&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" rel="nofollow">  
<img alt="runner-cypress in english" src="https://e2e-test-quest.github.io/uuv/img/cypress/screenshot.png" style="max-width: 100%;" width="75%" height="75%" />  
</a>  

### Demo in french
<a href="https://player.vimeo.com/video/822253247?texttrack=fr&h=617306172d&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" rel="nofollow">  
<img alt="runner-cypress in french" src="https://e2e-test-quest.github.io/uuv/img/cypress/screenshot.png" style="max-width: 100%;" width="75%" height="75%" />  
</a>   

## Installation

```bash  
npm install --save-dev @uuv/cypress
```  
or
```bash  
yarn add -D @uuv/cypress
``` 
## Configuration  (optional)
<a href="https://e2e-test-quest.github.io/uuv/docs/getting-started/configuration"><img src="https://img.shields.io/badge/Configure%20cypress%20doc-red?&style=for-the-badge&logo=github&logoColor=white" alt="documentation for configure uuv cypress"/></a>

## Usage
### Scenarios example
You can find test examples here : [weather-app.feature](https://github.com/e2e-test-quest/uuv/blob/main/example/weather-app.feature)

### Write test
To write your first test, create the file `uuv/e2e/first-test.feature` in the project root with the following content :
  ```gherkin
  Feature: Hello World

  Scenario: Search - Successful case
    When I visit path "/"
    Then I should see an element with role "heading" and name "My app title"
  ```

For more details, please go to the documentation:

<a href="https://e2e-test-quest.github.io/uuv/docs/test/first-test"><img src="https://img.shields.io/badge/Write%20test%20doc-red?&style=for-the-badge&logo=github&logoColor=white" alt="documentation for write test"/></a>

### Run test

#### browser mode
```bash  
npx uuv open
```  
or
```bash  
yarn uuv open
``` 

#### headless mode
Use for continuous integration([CI example](https://github.com/e2e-test-quest/kata-e2e-uuv/blob/main/.github/workflows/ci.yml)) or headless execution.
##### without args
```bash  
npx uuv e2e
```  
or
```bash  
yarn uuv e2e
```
##### with args
```bash  
npx uuv e2e --browser=edge --env="{'TAGS':'@mobile'}" --generateHtmlReport --targetTestFile=./uuv/e2e/first-test.feature
```
or
```bash  
yarn uuv e2e --browser=edge --env="{'TAGS':'@mobile'}" --generateHtmlReport --targetTestFile=./uuv/e2e/first-test.feature
```

For more details, please go to the documentation:

<a href="https://e2e-test-quest.github.io/uuv/docs/test/running-test"><img src="https://img.shields.io/badge/Run%20test%20doc-red?&style=for-the-badge&logo=github&logoColor=white" alt="documentation for run test"/></a>

## License

[<a href="https://github.com/e2e-test-quest/uuv/blob/main/LICENSE">  
<img src="https://img.shields.io/badge/license-MIT-blue" alt="MIT license"/>  
</a>](https://spdx.org/licenses/MIT.html)

This project is licensed under the terms of the [MIT license](https://github.com/e2e-test-quest/uuv/blob/main/LICENSE).

## Support UUV through Open Collective

If you want to help UUV grow, you can fund the project directly via [Open Collective](https://opencollective.com/uuv).  
Every contribution helps us dedicate more time and energy to improving this open-source tool.

<a href="https://opencollective.com/uuv/contribute" target="_blank">
  <img src="https://opencollective.com/uuv/contribute/button@2x.png?color=blue" width=300 />
</a>


Interested in becoming a sponsor?  
We welcome sponsorships of all sizes!  
Contact us via [GitHub](https://github.com/e2e-test-quest/uuv/discussions) or through [Open Collective](https://opencollective.com/uuv) to discuss opportunities.

## Authors

- [@luifr10](https://github.com/luifr10)
- [@stanlee974](https://github.com/stanlee974)

