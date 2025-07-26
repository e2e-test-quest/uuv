<p align="center">  
<a href="https://e2e-test-quest.github.io/uuv/">  
<picture>  
<img alt="UUV Logo" src="https://e2e-test-quest.github.io/uuv/img/uuv.png">  
</picture>  
</a>  
</p>  

# UUV - User centric Usecases Validator
<h3 align="center">  
Discovering your application by usecase validation  
</h3>  

<p align="center">  
Make test writing fast, understandable by any human understanding English or French.  
</p>  

## Benefits
- If used correctly, integrates accessibility from the development stage
- A living documentation is possible because we propose an unified language for developers and non-developers with a [rich dictionary](https://e2e-test-quest.github.io/uuv/docs/category/step-definition) of ready-to-use sentences
- [@uuv/assistant](https://e2e-test-quest.github.io/uuv/docs/tools/uuv-assistant) that facilitates the writing of tests by suggesting the most accessible sentences
- [JetBrains Plugin](https://e2e-test-quest.github.io/uuv/docs/tools/uuv-jetbrains-plugin) that helps you to write and execute your UUV E2E tests from JetBrains IDEs
- Integrates several runtime engines: Cypress / Playwright
- User friendly and standardized execution report([example](https://e2e-test-quest.github.io/kata-e2e-uuv/06-go-further/))
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

## Libraries
<a href="https://www.npmjs.com/package/@uuv/a11y"><img src="https://img.shields.io/badge/@uuv/a11y-uuv library to perform a11y checks-brown?logo=npm" alt="UUV a11y npm library"/></a>  
<a href="https://www.npmjs.com/package/@uuv/assistant"><img src="https://img.shields.io/badge/@uuv/assistant-Help module that generates the most accessible sentences based on a DOM element selection-yellow?logo=npm" alt="UUV assistant npm library"/></a>  
<a href="https://www.npmjs.com/package/@uuv/cypress"><img src="https://img.shields.io/badge/@uuv/cypress-Cypress engine to run uuv test-04C38E?logo=npm" alt="UUV cypress npm library"/></a>  
<a href="https://www.npmjs.com/package/@uuv/playwright"><img src="https://img.shields.io/badge/@uuv/playwright-Playwright engine to run uuv test-1dbb68?logo=npm" alt="UUV playwright npm library"/></a>  
<a href="https://www.npmjs.com/package/@uuv/runner-commons"><img src="https://img.shields.io/badge/@uuv/commons-shared library to use uuv-blue?logo=npm" alt="UUV commons npm library"/></a>

## Concepts

The `@uuv` library (User centric Usecases Validator) is an ecosystem that simplifies the writing of End to End tests in a BDD approach and a user-centric way.

### The problem

Automated software testing is a growing practice. It adds a better  
level of quality on the code of an application by verifying non-regression or validating use cases.


The `End to End test` is a technique used to verify if an application (web,  
mobile...) behaves as expected, from start to finish. It consists in verifying that the end user can complete the main usage scenarios of the application.

Unlike `unit test` which only aims to verifying the behavior of a function, or  
the `integration test` which consists in making several modules of the application interact with each other in order to see their good cooperation, the `End to End test` allows to check from a browser (for example for web applications) the behavior of your application according to a set of use cases.

> During the `E2E test`, the validations consist most of the time in checking the elements returned to the user via the web browser ([DOM](https://developer.mozilla.org/fr/docs/Web/API/Document_Object_Model))

Therefore, several additional questions arise:

- How to clearly express use cases?
- For omnichannel applications, how to check your application on different browsers and devices?  
  For omnichannel applications, how do you check your application on different browsers and devices?**
- How to perform relevant DOM checks from a user perspective

### Our solution

To answer the above issues and many others, our solution is to set up a coherent ecosystem based on tools that are references in their field.

![Ecosystème UUV](./packages/docs/static/img/docs/ecosystem-uuv.png)


## License

[<a href="https://github.com/e2e-test-quest/uuv/blob/main/LICENSE">  
<img src="https://img.shields.io/badge/license-MIT-blue" alt="MIT license"/>  
</a>](https://spdx.org/licenses/MIT.html)

This project is licensed under the terms of the [MIT license](https://github.com/e2e-test-quest/uuv/blob/main/LICENSE).

## Sponsorship & Funding
We thank the following parties for sponsoring this project:

<table>
  <tr>
    <td align="center" width="200px">
      <a href="https://www.jetbrains.com/">
        <img src="https://resources.jetbrains.com/storage/products/company/brand/logos/jetbrains.png" alt="JetBrains">
      </a>
      <br>
      <strong>JetBrains</strong>
      <br>
      Providing free open-source licenses for IntelliJ.
    </td>
    <td align="center" width="200px">
      <!-- Placeholder for future sponsor -->
    </td>
    <td align="center" width="200px">
      <!-- Placeholder for future sponsor -->
    </td>
  </tr>
</table>

### Support UUV through Open Collective

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

