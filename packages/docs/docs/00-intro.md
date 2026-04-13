import CodeBlock from '@theme/CodeBlock';

# Concepts

`@uuv` (**U**ser centric **U**secases **V**alidator) is an ecosystem that **simplifies** End to End test **writing** and **execution** using BDD (Behaviour Driven Development) and a user-centric approaches. Written **E2E tests** are therefore **understandable by any human being**.

:::info[✨ New: AI-Powered Test Generation with MCP]
Discover **[@uuv/mcp-server](/docs/tools/uuv-mcp-server)** - the AI-driven solution that automatically generates human-readable Gherkin test scenarios! Use LLMs like OpenAI, Anthropic, and Google to explore your app and generate accessible E2E tests in minutes.
:::

## The problem

Automated software testing is a growing practice. It adds a better
level of quality on the code of an application by verifying non-regression or validating use cases.

The `End to End test` is a technique used to verify if an application (web,
mobile...) behaves as expected, from start to finish. It consists in verifying that the end user can complete the main usage scenarios of the application.

Unlike `unit test` which only aims to verifying the behavior of a function, or
the `integration test` which consists in making several modules of the application interact with each other in order to see their good cooperation, the `End to End test` allows to check from a browser (for example for web applications), the `End to End test` allows to check from a browser (for example for web applications) the behavior of your application according to a set of use cases.

> During the `E2E test`, the validations consist most of the time in checking the elements returned to the user via the web browser ([DOM](https://developer.mozilla.org/fr/docs/Web/API/Document_Object_Model))

Therefore, several additional questions arise:

- How to clearly express use cases?
- For omnichannel applications, how to check your application on different browsers and devices?
  For omnichannel applications, how do you check your application on different browsers and devices?\*\*
- How to perform relevant DOM checks from a user perspective?
- How to guarantee that the application developed complies with digital accessibility requirements?

## Our solution

To answer the above issues and many others, our solution is to set up a coherent ecosystem based on tools that are references in their field.

![Ecosystème UUV](@site/static/img/docs/ecosystem-uuv.png)

- ### Accessibility
  - *[Testing Library](https://testing-library.com/docs/)* : To perform checks in the DOM based on the [accessible roles and attributes](https://www.w3.org/TR/accname-1.1/)
  - *[Axe Core](https://github.com/dequelabs/axe-core)* : To identify the accessibility's issues
  - *[@uuv/a11y](https://www.npmjs.com/package/@uuv/a11y)* : To perform rgaa accessibility checks _(development in progress)_
  

- ### BDD : Behaviour Driven Development
  - *[Cucumber](https://cucumber.io/)* : In order to express the use cases in a human-readable language
  

- ### Runners : You can choose between 
  - *[Cypress](https://www.cypress.io/)* -> [@uuv/cypress](https://www.npmjs.com/package/@uuv/cypress)
  - *[Playwright](https://playwright.dev/)* -> [@uuv/playwright](https://www.npmjs.com/package/@uuv/playwright)

- ### MCP (Model Context Protocol) Server
    - _[@uuv/mcp-server](./tools/uuv-mcp-server)_ : AI-driven test generation and integration with LLMs
      <br/>Automatically generates human-readable Gherkin test scenarios using OpenAI, Anthropic, Google, or Ollama LLMs
## The benefits

- If used correctly, integrates accessibility from the development stage
- AI-driven test generation with MCP server for automated test creation and suggestions
- A living documentation is possible because we propose an unified language for developers and non-developers with a [rich dictionary](category/step-definition) of ready-to-use sentences
- [@uuv/assistant](tools/uuv-assistant) that facilitates the writing of tests by suggesting the most accessible sentences
- [JetBrains Plugin](tools/uuv-jetbrains-plugin) that helps you to write and execute your UUV E2E tests from JetBrains IDEs
- Integrates several runtime engines: Cypress / Playwright
- User friendly and standardized execution report([example](https://e2e-test-quest.github.io/kata-e2e-uuv/06-go-further/))

### Comparison
|                      Criteria                       | Cypress | Playwright | Testing library | UUV |  
|:---------------------------------------------------:|:-: |:-: |:-: |:-: |  
|                    User centrism                    | :x: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  
|                Native accessibility                 | :x: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  
|        Easy setup configuration for BDD test        | :warning: | :warning: | :heavy_minus_sign: | :heavy_check_mark: |  
| Understandable by everyone <br/> (included non dev) | :x: | :x: | :x: | :heavy_check_mark: |  

### Syntax example
With this dom example :
```html
  <body>
  <h1>Result<h1>
  </body>
```

we see that the sentence proposed by **UUV is the most understandable** of all<br/>

| Library         | Syntax                                                                                      |
|:----------------|:--------------------------------------------------------------------------------------------|
| Cypress         | <CodeBlock language="js">cy.get('h1').contains('Result')</CodeBlock>                       |
| Playwright      | <CodeBlock language="js">await expect(page.getByTitle('Result')).toHaveCount(1)</CodeBlock> |
| Testing library | <CodeBlock language="js">expect(screen.getByTitle(/Result/i)).toBeTruthy() </CodeBlock>     |
| UUV             | <CodeBlock language="gherkin">Then I should see a title named "Result"</CodeBlock>          |
