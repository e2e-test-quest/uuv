
# @uuv/a11y
<div align="center">  
<a href="https://e2e-test-quest.github.io/uuv/">  
<picture>  
<img alt="UUV Logo" src="https://e2e-test-quest.github.io/uuv/img/uuv.png">  
</picture>  
</a>  
</div>  

<h3 align="center">  
Automated a11y validation
</h3>  

<p align="center">  
@uuv/a11y is a solution for automated accessibility validations
</p>  

<p align="center">  
<a href="https://www.npmjs.com/package/@uuv/commons" target="_blank">  
<img src="https://img.shields.io/badge/available%20on%20npm-grey?logo=npm" alt="npm"/>  
</a>  
<a href="https://www.npmjs.com/package/@uuv/commons" target="_blank">  
<img src="https://img.shields.io/badge/accessibility-yes-green" alt="accessibility"/>  
</a>  
<a href="https://jestjs.io/fr/" target="_blank">  
<img src="https://img.shields.io/badge/tested%20with-jest-yellow?logo=jest" alt="jest"/>  
</a>  
<br />  
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

## What is @uuv/a11y?

<p align="center">  

The `@uuv` library (User centric Usecases Validator) is an accessibility driven solution to facilitate the writing and execution of end-to-end tests that are understandable to any human being.

`@uuv/a11y` is the part of this solution used to perform automated accessibility checks to guarantee non-regression.


## How it works ?
The following references are available :

### RGAA

For each criterion of the RGAA, the following algorithm is executed :

 ![Diagram a11Y RGAA](https://unpkg.com/@uuv/a11y/docs/diagram-a11y-rgaa.png)

**Consult [this page](https://e2e-test-quest.github.io/uuv/docs/tools/uuv-a11y#rgaa) to find out which RGAA verifications are implemented in the library**
</p>  

## Usage
### With UNPKG
1.  Add script tag to import @uuv/a11y in your html page :
    ```html
    <script src="https://unpkg.com/@uuv/a11y/bundle/uuv-a11y.bundle.js">
    </script>
    ```
2. Add script tag to execute
    ```html
    <script type="module">
      const rgaaChecker = new uuvA11y.RgaaChecker(window.location.url);
      const result = await rgaaChecker.validate().toPromise();
      // Print complete result
      console.log('result', result);
      // Print result summary group by criteria
      console.log('summary', result.summary());
    </script>
    ```
  [Stackblitz example](https://stackblitz.com/edit/web-platform-fihgra?devToolsHeight=33&file=index.html)

### As a dependency
1. Import @uuv/a11y npm dependency
    ```shell
    npm install -D @uuv/a11y
    ```
2. Use it in your file
    ```typescript
    import {
      RgaaChecker,
      A11yResult,
    } from "@uuv/a11y";
    
    const currentUrl = "<set your current url>";
    const rgaaChecker = new RgaaChecker(currentUrl, enabledRules);
    const result: A11yResult = await rgaaChecker.validate().toPromise();
    // Print complete result
    console.log(result);
    // Print result summary group by criteria
    console.log(result.summary());
    ```
### During E2E Testing (recommended usage because it allows DOM nodes to be visualized)
1. add `@uuv/cypress` npm dependency :
    ```shell
    npm install --save-dev @uuv/cypress
    ```
   2. create the file `uuv/e2e/a11y.feature` in the project root with the following content and replace url `https://e2e-test-quest.github.io/simple-webapp/a11y-test.html` by yours :
       ```gherkin
       Feature: A11y validation
          
          Scenario: Default RGAA
            When I visit path "https://e2e-test-quest.github.io/simple-webapp/a11y-test.html"
            Then I should not have any rgaa accessibility issue
      
          Scenario: RGAA with partial result
            When I visit path "https://e2e-test-quest.github.io/simple-webapp/a11y-test.html"
            Then I should have the following partial result based on the rgaa reference
               """json
               {
                  "status": "error",
                  "criteria": {
                     "1.5": {
                        "status": "manual"
                     },
                     "1.6": {
                        "status": "manual",
                        "tests": {
                           "1.6.5": {
                              "status": "success"
                           }
                        }
                     },
                     "11.1": {
                        "status": "success",
                        "tests": {
                           "11.1.1": {
                              "status": "success"
                           }
                        }
                     }
                  }
               }
               """
          ```
   You can also see the [French example](https://github.com/e2e-test-quest/uuv/blob/main/example/fr-rgaa.feature) or the complete [English example](https://github.com/e2e-test-quest/uuv/blob/main/example/en-rgaa.feature).
3. Then execute your tests :
    ```shell
    npx uuv e2e
    ```

## Want to contribute ?
Your help is welcome, see the [Contributors guide](https://github.com/e2e-test-quest/uuv/blob/main/packages/a11y/CONTRIBUTING.md).

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
