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
import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

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

#### (Optional) Use UUV Cypress Commands

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
        "types": ["@uuv/playwright"]
    },
    "include": ["uuv/cucumber/step_definitions/**/*.ts"]
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

#### (Optional) Use UUV Playwright Locator

When writing your own sentences, you can use :

##### `getPageOrElement(world: World): Promise<Locator | Page>`

> Retrieves the current page or element based on the selected element cookie filters. Applies all filters from the cookie to locate the specific element or page.

---

##### `addCookie(world: World, cookieName: COOKIE_NAME, newCookie: CustomCookieValue): Promise<void>`

> Adds a cookie to the browser context with a test-specific name. Handles different cookie types: MOCK_URL (with consumption tracking), SELECTED_ELEMENT, and TIMEOUT.

---

##### `getCookie(world: World, cookieName: COOKIE_NAME): Promise<CustomCookie>`

> Retrieves a cookie from the browser context by name. Returns a CustomCookie instance with the cookie data or a default empty cookie if not found.

---

##### `deleteCookieByName(world: World, cookieName: COOKIE_NAME): Promise<void>`

> Deletes a cookie by setting its expiration date to 0.

---

##### `withinSelector(world: World, selector: string): Promise<void>`

> Locates an element by CSS selector and saves it as the selected element cookie. Subsequent operations will be relative to this element until cleared.

---

##### `withinRoleAndName(world: World, role: string, name: string): Promise<void>`

> Locates an element within a specific role and name, then saves it as the selected element cookie. Subsequent operations will be relative to this element until cleared.

---

##### `getWithContent(world: World, textContent: string): Promise<Locator>`

> Gets all elements matching the text content relative to the current selected element or page. Use this when you expect multiple matching elements.

---

##### `getWithTestId(world: World, testId: string): Promise<Locator>`

> Gets all elements matching the test ID relative to the current selected element or page. Use this when you expect multiple matching elements.

---

##### `getWithAriaLabel(world: World, expectedAriaLabel: string): Promise<Locator>`

> Gets all elements matching the ARIA label relative to the current selected element or page. Use this when you expect multiple matching elements.

---

##### `findWithSelector(world: World, selector: string): Promise<LocatorTest>`

> Finds exactly one element by CSS selector relative to the current selected element or page. Verifies the element exists and focuses it.

---

##### `findWithTestId(world: World, testId: string): Promise<LocatorTest>`

> Finds exactly one element by test ID relative to the current selected element or page. Verifies the element exists and returns its locator.

---

##### `findWithAriaLabel(world: World, expectedAriaLabel: string): Promise<LocatorTest>`

> Finds exactly one element by ARIA label relative to the current selected element or page. Verifies the element exists and returns its locator.

---

##### `findWithRoleAndName(world: World, role: string, name: string, otherRoleOptions = {}): Promise<LocatorTest>`

> Finds exactly one element by role and name. Verifies the element exists and focuses it.

---

##### `findWithRoleAndNameAndContent(world: World, expectedRole: string, name: string, expectedTextContent?: string, otherRoleOptions = {}): Promise<LocatorTest>`

> Finds exactly one element by role and name, with optional text content match. Verifies the element count is 1, optionally checks text content, and focuses the element.

---

##### `notFoundWithRoleAndName(world: World, role: string, name: string): Promise<void>`

> Finds an element by role and name, verifying it does NOT exist (count should be 0).

---

##### `findWithRoleAndNameFocused(world: World, expectedRole: string, name: string): Promise<LocatorTest>`

> Finds exactly one element by role and name that is currently focused. Verifies the element exists and is focused.

---

##### `findWithRoleAndNameAndChecked(world: World, expectedRole: string, name: string): Promise<LocatorTest>`

> Finds exactly one element by role and name that is currently checked (e.g., checkbox/radio). Verifies the element exists and is checked.

---

##### `findWithRoleAndNameAndUnchecked(world: World, expectedRole: string, name: string): Promise<LocatorTest>`

> Finds exactly one element by role and name that is currently unchecked (e.g., checkbox/radio). Verifies the element exists and is unchecked.

---

##### `findWithRoleAndNameAndContentDisabled(world: World, expectedRole: string, name: string, expectedTextContent: string): Promise<LocatorTest>`

> Finds exactly one element by role and name with specific text content that is disabled. Verifies the element exists, has the specified text content, and is disabled.

---

##### `findWithRoleAndNameDisabled(world: World, expectedRole: string, name: string): Promise<LocatorTest>`

> Finds exactly one element by role and name that is disabled. Verifies the element exists and is disabled.

---

##### `findWithRoleAndNameAndContentEnabled(world: World, expectedRole: string, name: string, expectedTextContent: string): Promise<LocatorTest>`

> Finds exactly one element by role and name with specific text content that is enabled. Verifies the element exists, has the specified text content, and is enabled.

---

##### `findWithRoleAndNameEnabled(world: World, expectedRole: string, name: string): Promise<LocatorTest>`

> Finds exactly one element by role and name that is enabled. Verifies the element exists and is enabled.

---

##### `click(world: World, role: any, name: string): Promise<void>`

> Clicks on an element by role and name, then clears the selected element cookie.

---

##### `clickFocusedElement(world: World): Promise<void>`

> Clicks on the currently focused element in the browser. Uses the :focus selector to identify the active element and clicks it. If no element is focused, clicks on the current page/selected element.

---

##### `type(world: World, role: any, name: string, textToType: string): Promise<LocatorTest>`

> Types text into an element by role and name, then clears the selected element cookie.

---

##### `typeFocusedElement(world: World, textToType: string): Promise<void>`

> Types text into the currently focused element. If no element is focused, focuses the current page/selected element first.

---

##### `findWithRoleAndNameAndValue(world: World, expectedRole: string, name: string, expectedValue: string): Promise<LocatorTest>`

> Finds exactly one element by role and name that has a specific value. Verifies the element exists and has the expected value attribute.

---

##### `getTimeout(world: World): Promise<number>`

> Gets the current timeout value from the TIMEOUT cookie, or returns the default timeout.

---

##### `setTimeout(world: World, newTimeout: number): Promise<void>`

> Sets a new timeout value by storing it in the TIMEOUT cookie.
