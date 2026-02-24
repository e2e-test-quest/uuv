import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Ajouter vos propres phrases

## Cypress

### Installation des dépendances

Depuis powershell ou un terminal cmd :

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

### Ajout des types Typescripts

:::info
Cette étape n'est nécessaire que si vous prévoyez de rajouter vos propres [step_definitions](/docs/wordings/add-custom-step-definition).
:::
Ajouter un nouveau fichier `tsconfig.e2e.json` pour inclure les types nécessaires :

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

### Ajout de vos propres phrases

Créer un fichier `.ts` ou `.js` dans le dossier `uuv/cucumber/step_definitions/`.<br/>
Voici un exemple :

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

Pour plus d'informations sur la mise en place de phrases cucumber, consulter cette [documentation](https://cucumber.io/docs/cucumber/step-definitions/?sbsearch=step+definition&lang=javascript)

#### (Optionnel) Utilisation des commandes Cypress UUV

Lors de la rédaction de vos propres phrases, vous pouvez utiliser :

- [Les commandes Cypress par défaut](https://docs.cypress.io/api/table-of-contents#Commands)
- [Les commandes Cypress Testing Library](https://testing-library.com/docs/cypress-testing-library/intro#usage)
- Les commandes `Cypress UVV` suivantes :

##### `uuvGetContext(): Cypress.Chainable<Context>`

> Retourne le contexte courant (élément Dom sélectionné & timeout) UUV

---

##### `uuvCheckContextFocusedElement(): Cypress.Chainable<Context>`

> Retourne élément Dom sélectionné dans le contexte UUV

---

##### `uuvPatchContext(partOfContext: any): Chainable<Context>`

> Mise à jour du contexte UUV

---

##### `uuvFindByText(textToSearch: string, roleOptions: ByRoleOptions): Cypress.Chainable<JQuery<HTMLElement>>`

> Recherche d'un élément à partir de son contenu textuel

---

##### `uuvFindByTestId(testId: string): Cypress.Chainable<JQuery<HTMLElement>>`

> Recherche d'un élément à partir de son attribut data-testid

---

##### `uuvFindByRole(role: string, roleOptions: ByRoleOptions): Cypress.Chainable<JQuery<HTMLElement>>`

> Recherche d'un élément à partir de son rôle accessible

---

##### `uuvFindByLabelText(labelTextToSearch: string, roleOptions: ByRoleOptions): Cypress.Chainable<JQuery<HTMLElement>>`

> Recherche d'un élément à partir de son libellé (idéal pour les champs de formulaire)

---

##### `uuvFindAllByRole(role: string, roleOptions: ByRoleOptions): Cypress.Chainable<JQuery<HTMLElement>>`

> Recherche tous les éléments correspondant à un rôle accessible

---

##### `uuvFoundedElement(): Cypress.Chainable<JQuery<HTMLElement>>`

> Retourne l'élément trouvé lorsqu'une recherche a été effectuée

### Utilisation de vos propres phrases

```gherkin title='uuv/e2e/first-test.feature'
Feature: Hello World

  Scenario: Search - Successful case
    When I visit path "https://e2e-test-quest.github.io/weather-app/"
    Then I should see a title named "Welcome to Weather App"
    And My second custom step definition
```

## Playwright

### Ajout des types Typescripts

:::info
Cette étape n'est nécessaire que si vous prévoyez de rajouter vos propres [step_definitions](/docs/wordings/add-custom-step-definition).
:::
Ajouter un nouveau fichier `tsconfig.e2e.json` pour inclure les types nécessaires :

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

### Ajout de vos propres phrases

Créer un fichier `.ts` ou `.js` dans le dossier `uuv/cucumber/step_definitions/`.<br/>
Voici un exemple :

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

Pour plus d'informations sur la mise en place de phrases cucumber, consulter cette [documentation](https://cucumber.io/docs/cucumber/step-definitions/?sbsearch=step+definition&lang=javascript)

### Utilisation de vos propres phrases

```gherkin title='uuv/e2e/first-test.feature'
Feature: Hello World

  Scenario: Search - Successful case
    When I visit path "https://e2e-test-quest.github.io/weather-app/"
    Then I should see a title named "Welcome to Weather App"
    And My second custom step definition
```

#### (Optionnel) Utilisation des locateurs UUV Playwright

Lors de la rédaction de vos propres phrases, vous pouvez utiliser :

##### `getPageOrElement(world: World): Promise<Locator | Page>`

> Récupère la page ou l'élément actuel en fonction des filtres de cookie d'élément sélectionné. Applique tous les filtres du cookie pour localiser l'élément spécifié ou la page.

---

##### `addCookie(world: World, cookieName: COOKIE_NAME, newCookie: CustomCookieValue): Promise<void>`

> Ajoute un cookie au contexte du navigateur avec un nom spécifique aux tests. Gère les types de cookies différents : MOCK_URL (avec suivi de consommation), SELECTED_ELEMENT et TIMEOUT.

---

##### `getCookie(world: World, cookieName: COOKIE_NAME): Promise<CustomCookie>`

> Récupère un cookie du contexte du navigateur par son nom. Renvoie une instance CustomCookie avec les données du cookie ou un cookie vide par défaut si non trouvé.

---

##### `deleteCookieByName(world: World, cookieName: COOKIE_NAME): Promise<void>`

> Supprime un cookie en définissant sa date d'expiration à 0.

---

##### `withinSelector(world: World, selector: string): Promise<void>`

> Localise un élément par sélecteur CSS et le sauvegarde comme cookie d'élément sélectionné. Les opérations ultérieures seront relatives à cet élément jusqu'à ce qu'il soit effacé.

---

##### `withinRoleAndName(world: World, role: string, name: string): Promise<void>`

> Localise un élément dans un rôle et un nom spécifiques, puis le sauvegarde comme cookie d'élément sélectionné. Les opérations ultérieures seront relatives à cet élément jusqu'à ce qu'il soit effacé.

---

##### `getWithContent(world: World, textContent: string): Promise<Locator>`

> Récupère tous les éléments correspondant au contenu textuel par rapport à l'élément sélectionné actuel ou à la page. Utilisez ceci lorsque vous vous attendez à plusieurs éléments correspondants.

---

##### `getwithTestId(world: World, testId: string): Promise<Locator>`

> Récupère tous les éléments correspondant à l'ID de test par rapport à l'élément sélectionné actuel ou à la page. Utilisez ceci lorsque vous vous attendez à plusieurs éléments correspondants.

---

##### `getwithAriaLabel(world: World, expectedAriaLabel: string): Promise<Locator>`

> Récupère tous les éléments correspondant au libellé ARIA par rapport à l'élément sélectionné actuel ou à la page. Utilisez ceci lorsque vous vous attendez à plusieurs éléments correspondants.

---

##### `findWithSelector(world: World, selector: string): Promise<LocatorTest>`

> Trouve exactement un élément par sélecteur CSS par rapport à l'élément sélectionné actuel ou à la page. Vérifie que l'élément existe et le met en focus.

---

##### `findWithTestId(world: World, testId: string): Promise<LocatorTest>`

> Trouve exactement un élément par ID de test par rapport à l'élément sélectionné actuel ou à la page. Vérifie que l'élément existe et renvoie son locateur.

---

##### `findWithAriaLabel(world: World, expectedAriaLabel: string): Promise<LocatorTest>`

> Trouve exactement un élément par libellé ARIA par rapport à l'élément sélectionné actuel ou à la page. Vérifie que l'élément existe et renvoie son locateur.

---

##### `findWithRoleAndName(world: World, role: string, name: string, otherRoleOptions = {}): Promise<LocatorTest>`

> Trouve exactement un élément par rôle et nom. Vérifie que l'élément existe et le met en focus.

---

##### `findWithRoleAndNameAndContent(world: World, expectedRole: string, name: string, expectedTextContent?: string, otherRoleOptions = {}): Promise<LocatorTest>`

> Trouve exactement un élément par rôle et nom, avec la possibilité de correspondre un contenu textuel. Vérifie que le nombre d'éléments est 1, vérifie éventuellement le contenu textuel et met l'élément en focus.

---

##### `notFoundWithRoleAndName(world: World, role: string, name: string): Promise<void>`

> Trouve un élément par rôle et nom, en vérifiant qu'il N'EXISTE PAS (le nombre doit être 0).

---

##### `findWithRoleAndNameFocused(world: World, expectedRole: string, name: string): Promise<LocatorTest>`

> Trouve exactement un élément par rôle et nom qui est actuellement mis en focus. Vérifie que l'élément existe et est mis en focus.

---

##### `findWithRoleAndNameAndChecked(world: World, expectedRole: string, name: string): Promise<LocatorTest>`

> Trouve exactement un élément par rôle et nom qui est actuellement coché (ex. case à cocher/radio). Vérifie que l'élément existe et est coché.

---

##### `findWithRoleAndNameAndUnchecked(world: World, expectedRole: string, name: string): Promise<LocatorTest>`

> Trouve exactement un élément par rôle et nom qui est actuellement non coché (ex. case à cocher/radio). Vérifie que l'élément existe et est non coché.

---

##### `findWithRoleAndNameAndContentDisabled(world: World, expectedRole: string, name: string, expectedTextContent: string): Promise<LocatorTest>`

> Trouve exactement un élément par rôle et nom avec un contenu textuel spécifique qui est désactivé. Vérifie que l'élément existe, a le contenu textuel spécifié et est désactivé.

---

##### `findWithRoleAndNameDisabled(world: World, expectedRole: string, name: string): Promise<LocatorTest>`

> Trouve exactement un élément par rôle et nom qui est désactivé. Vérifie que l'élément existe et est désactivé.

---

##### `findWithRoleAndNameAndContentEnabled(world: World, expectedRole: string, name: string, expectedTextContent: string): Promise<LocatorTest>`

> Trouve exactement un élément par rôle et nom avec un contenu textuel spécifique qui est activé. Vérifie que l'élément existe, a le contenu textuel spécifié et est activé.

---

##### `findWithRoleAndNameEnabled(world: World, expectedRole: string, name: string): Promise<LocatorTest>`

> Trouve exactement un élément par rôle et nom qui est activé. Vérifie que l'élément existe et est activé.

---

##### `click(world: World, role: any, name: string): Promise<void>`

> Clique sur un élément par rôle et nom, puis efface le cookie d'élément sélectionné.

---

##### `clickFocusedElement(world: World): Promise<void>`

> Clique sur l'élément actuellement mis en focus dans le navigateur. Utilise le sélecteur :focus pour identifier l'élément actif et le clique. Si aucun élément n'est mis en focus, clique sur la page/élément actuel.

---

##### `type(world: World, role: any, name: string, textToType: string): Promise<LocatorTest>`

> Tape du texte dans un élément par rôle et nom, puis efface le cookie d'élément sélectionné.

---

##### `typeFocusedElement(world: World, textToType: string): Promise<void>`

> Tape du texte dans l'élément actuellement mis en focus. Si aucun élément n'est mis en focus, met en focus la page/élément actuel en premier.

---

##### `findWithRoleAndNameAndValue(world: World, expectedRole: string, name: string, expectedValue: string): Promise<LocatorTest>`

> Trouve exactement un élément par rôle et nom qui a une valeur spécifique. Vérifie que l'élément existe et a l'attribut de valeur attendu.

---

##### `getTimeout(world: World): Promise<number>`

> Récupère la valeur de timeout actuelle à partir du cookie TIMEOUT, ou retourne le timeout par défaut.

---

##### `setTimeout(world: World, newTimeout: number): Promise<void>`

> Définit une nouvelle valeur de timeout en la stockant dans le cookie TIMEOUT.
