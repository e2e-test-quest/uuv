import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Add custom step definitions

## Cypress
### Install dependencies

From powershell or cmd terminal :

<Tabs>
<TabItem value="npm" label="Npm">

```shell
npm install --save-dev ts-loader
```

</TabItem>
<TabItem value="Yarn" label="Yarn">

```shell
yarn add -D ts-loader
```

</TabItem>
</Tabs>

### Add Typescript types
:::warning
This step is only necessary if you plan to add your own [step_definitions](/docs/wordings/add-custom-step-definition).
:::
Add a new file `tsconfig.e2e.json` to include the necessary types :

```json title='tsconfig.e2e.json'
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./out-tsc/app",
    "types": [
      "cypress",
      "@testing-library/cypress",
      "@uuv/cypress"
    ]
  },
  "files": [
    "uuv/cypress.config.ts"
  ],
  "include": [
    "src/**/*.cy.ts"
  ]
}
```

### Create custom step definition
Create new `.ts` or `.js` file in the `uuv/cucumber/step_definitions/` folder.<br/>
Here is an example :
```typescript title='uuv/cucumber/step_definitions/my-custom-step-definitions.ts'
import {Given, When, Then} from "@badeball/cypress-cucumber-preprocessor";

Given('My first custom step definition', () => {
    const myVar = 'foo';
    expect(myVar).to.eq('a foo');
});

Then('My second custom step definition', () => {
    // Your verification
    expect(true).to.eq(true);
});

```
For more information on setting up custom step definition, see this [documentation](https://cucumber.io/docs/cucumber/step-definitions/?sbsearch=step+definition&lang=javascript)

#### (Optionnel) Utilisation des commandes Cypress UUV
When writing your own sentences, you can use :
- [Cypress default commands](https://docs.cypress.io/api/table-of-contents#Commands) 
- [Testing Library Cypress commands](https://testing-library.com/docs/cypress-testing-library/intro#usage)
- Following `Cypress UVV` command :

##### `uuvGetContext(): Cypress.Chainable<Context>`
> Returns the current UUV context (selected Dom element & timeout)

---

##### `uuvCheckContextFocusedElement(): Cypress.Chainable<Context>`
> Returns Dom element selected in UUV context

---

##### `uuvPatchContext(partOfContext: any): Chainable<Context>`
> Update of UUV context

---

##### `uuvFindByText(textToSearch: string, roleOptions: ByRoleOptions): Cypress.Chainable<JQuery<HTMLElement>>`
> Look for an element from its textual content

---

##### `uuvFindByTestId(testId: string): Cypress.Chainable<JQuery<HTMLElement>>`
> Look for an element from its data-testid attribute

---

##### `uuvFindByRole(role: string, roleOptions: ByRoleOptions): Cypress.Chainable<JQuery<HTMLElement>>`
> Look for an element from its accessible role

---

##### `uuvFindByLabelText(labelTextToSearch: string, roleOptions: ByRoleOptions): Cypress.Chainable<JQuery<HTMLElement>>`
> Look for an element from its label (ideal for form fields)

---

##### `uuvFindAllByRole(role: string, roleOptions: ByRoleOptions): Cypress.Chainable<JQuery<HTMLElement>>`
> Look for all items matching an accessible role

---

##### `uuvFoundedElement(): Cypress.Chainable<JQuery<HTMLElement>>`
> Returns the item found when a query has been performed

### Use your custom step definition
```gherkin title='uuv/e2e/first-test.feature'
Feature: Hello World

  Scenario: Search - Successful case
    When I visit path "https://e2e-test-quest.github.io/weather-app/"
    Then I should see a title named "Welcome to Weather App"
    And My second custom step definition
```

## Playwright

### Add Typescript types
:::warning
This step is only necessary if you plan to add your own [step_definitions](/docs/wordings/add-custom-step-definition).
:::
Add a new file `tsconfig.e2e.json` to include the necessary types :

```json title='tsconfig.e2e.json'
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./out-tsc/app",
    "types": [
      "@uuv/playwright"
    ]
  },
  "include": [
    "uuv/cucumber/step_definitions/**/*.ts"
  ]
}
```

### Create custom step definition
Create new `.ts` or `.js` file in the `uuv/cucumber/step_definitions/` folder.<br/>
Here is an example :
```typescript title='uuv/cucumber/step_definitions/my-custom-step-definitions.ts'
import { expect } from "@playwright/test";
import { World, Given, Then } from "@uuv/playwright";

Given('My first custom step definition', async function () {
    const myVar = 'foo';
    expect(myVar).toBe('a foo');
});

Then('My second custom step definition', async function (this: World) {
    // Your verification
    expect(this.page.getByRole('heading', { name: 'Mon titre de page' })).toBeVisible();
});
```
For more information on setting up custom step definition, see this [documentation](https://cucumber.io/docs/cucumber/step-definitions/?sbsearch=step+definition&lang=javascript)

### Use your custom step definition
```gherkin title='uuv/e2e/first-test.feature'
Feature: Hello World

  Scenario: Search - Successful case
    When I visit path "https://e2e-test-quest.github.io/weather-app/"
    Then I should see a title named "Welcome to Weather App"
    And My second custom step definition
```
