# @uuv/assistant
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
<a href="https://www.npmjs.com/package/@uuv/assistant" target="_blank">  
<img src="https://img.shields.io/badge/available%20on%20npm-grey?logo=npm" alt="npm"/>  
</a>  
<a href="https://www.npmjs.com/package/@uuv/assistant" target="_blank">  
<img src="https://img.shields.io/badge/using-react-00DCFF?logo=react" alt="npm"/>  
</a>  
<a href="https://jestjs.io/fr/" target="_blank">  
<img src="https://img.shields.io/badge/tested%20with-jest-yellow?logo=jest" alt="jest"/>  
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

## What is @uuv/assistant ?

<p align="center">  

`@uuv` library (User centric Usecases Validator) is an ecosystem that simplifies the writing of End to End tests in a BDD approach and a user-centric way.

With `@uuv/assistant`, we can generate cucumber sentences that will use an execution engine like cypress with [@uuv/cypress](https://www.npmjs.com/package/@uuv/cypress) or playwright with [@uuv/playwright](https://www.npmjs.com/package/@uuv/playwright).
</p>  

## Benefits
- If used correctly, integrates accessibility from the development stage
- A living documentation is possible because we propose an unified language for developers and non-developers with a [rich dictionary](https://e2e-test-quest.github.io/uuv/docs/category/step-definition) of ready-to-use sentences
- [@uuv/assistant](https://e2e-test-quest.github.io/uuv/docs/tools/uuv-assistant) that facilitates the writing of tests by suggesting the most accessible sentences
- [JetBrains Plugin](https://e2e-test-quest.github.io/uuv/docs/tools/uuv-jetbrains-plugin) that helps you to write and execute your UUV E2E tests from JetBrains IDEs
- Integrates several runtime engines: Cypress / Playwright
- User friendly and standardized execution report([example](https://e2e-test-quest.github.io/kata-e2e-uuv/
  ### <u>Comparison</u>
| Criteria | Cypress | Playwright | Testing library | UUV |  
|:-: |:-: |:-: |:-: |:-: |  
| User centrism | :x: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  
| Native accessibility | :x: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  
| Easy setup configuration for BDD test | :warning: | :warning: | :heavy_minus_sign: | :heavy_check_mark: |  
| Understandable by everyone </br> (included non dev) | :x: | :x: | :x: | :heavy_check_mark: |  

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

## Screenshots
<img src="https://e2e-test-quest.github.io/uuv/img/assistant/screenshots.gif" alt="assistant screenshots"/>  

## Online demo

<a href="https://uuv-assistant.vercel.app/">
    <img src="https://e2e-test-quest.github.io/uuv/img/assistant/online-demo.png" alt="assistant online demo"/>  
</a>

## Installation
### NPM Package
```bash
npm install --save-dev @uuv/assistant
```
or
```bash
yarn add -D @uuv/assistant
```
### Desktop executable
1. Download executable using the following button </br>
<a href="https://github.com/e2e-test-quest/uuv/releases/latest/download/uuv-assistant-win32-x64.zip"><img src="https://img.shields.io/badge/download_uuv--assistant_desktop-black?&style=for-the-badge&logo=github&logoColor=white" alt="documentation"/></a>
2. Unzip the downloaded zip file


## Usage
### NPM Package
To launch uuv assistant :
```bash
npx uuv-assistant --targetUrl=<targetUrl>
```
| Name        | Description                                                                                                   | Example                               |
|-------------|---------------------------------------------------------------------------------------------------------------|---------------------------------------|
| `targetUrl` | Target website url                                                                                            | https://e2e-test-quest.github.io/uuv/ |

### Desktop executable
Execute `uuv-assistant.exe` from the unzipped folder

## Scenario examples
You can find test examples here : [weather-app.feature](https://github.com/e2e-test-quest/uuv/blob/main/example/weather-app.feature)

The dictionary is available in french and english. It can be accessed with this link:

<a href="https://e2e-test-quest.github.io/uuv/docs/wordings/generated-wording-description/en-generated-wording-description"><img src="https://img.shields.io/badge/sentences%20dictionary-red?&style=for-the-badge&logo=github&logoColor=white" alt="documentation containing sentences"/></a>

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
