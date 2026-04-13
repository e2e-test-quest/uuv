import CodeBlock from '@theme/CodeBlock';

# Concepts

`@uuv` (**U**ser centric **U**secases **V**alidator) est un écosystème qui **simplifie** l'**écriture** et l'**exécution** de tests
End to End dans une approche BDD et du point de vue d'utilisateur final. Les **tests E2E** écrits sont donc **compréhensibles par tout être humain**

:::info[✨ Nouveau : Génération de tests avec l'IA(MCP)]
Découvrez **[@uuv/mcp-server](#serveur-mcp-model-context-protocol)** - la solution IA qui génère automatiquement des scénarios Gherkin lisibles par un humain ! Utilisez des LLM comme OpenAI, Anthropic et Google pour explorer votre application et générer des tests E2E accessibles en quelques minutes.
:::

## Le problème

La mise en place de tests de logiciels automatisés est une pratique de plus en plus répandue. Cela ajoute un meilleur
niveau de qualité sur le code d’une application par la vérification de la non-regression ou encore la validation des
scénarios d'utilisation.

La typologie de `test End to End` (de bout en bout) est une technique utilisée pour vérifier si une application (web,
mobile...) se comporte comme prévu, du début à la fin. Elle consiste à vérifier que l’utilisateur final puisse achever
les principaux scénarios d’utilisation de l’application.

Contrairement au `test unitaire` qui a pour seul but de verifier le comportement d’une fonction, ou
au `test d'intégration` qui consiste à faire interagir plusieurs modules de l’application entre eux afin de voir leur
bonne coopération, Le `test End to End` permet de vérifier depuis un navigateur (par exemple pour les applications web)
le comportement de votre application d'après un ensemble de scénarios d'utilisation.

> Lors des `test E2E`, les validations consistent la plupart du temps à vérifier les éléments restitués à l'utilisateur
> via le navigateur web ([DOM](https://developer.mozilla.org/fr/docs/Web/API/Document_Object_Model))

Dès lors, plusieurs questions complémentaires se posent :

- **Comment exprimer clairement des scénarios d'utilisation ?**
- **Pour les applications omnicanales, comment faire pour vérifier votre application sur différents navigateurs et
  terminaux ?**
- **Comment effectuer des vérifications de DOM pertinents en gardant un point de vue utilisateur ?**
- **Comment garantir que l'application développée est conforme aux exigences d'accessibilité numérique** ?

## Notre solution

Pour répondre aux problématiques ci-dessus et bien d'autres, nous avons créer la librairie UUV, il s'agit d'une solution basée sur l'accessibilité pour faciliter l'écriture et l'exécution des tests bout en bout dans un langage compréhensible par tout être humain.

UUV est un écosystème cohérent s'appuyant sur des outils qui sont des références dans leur domaine.

## Ecosystème
![Ecosystème UUV](@site/static/img/docs/ecosystem-uuv.png)

- ### Accessibilité
  - *[Testing Library](https://testing-library.com/docs/)* : Pour effectuer des vérifications de DOM basées [les roles et attributs accessibles](https://www.w3.org/TR/accname-1.1/)
  - *[Axe Core](https://github.com/dequelabs/axe-core)* : Pour détecter les anomalies d'accessibilité
  - *[@uuv/a11y](https://www.npmjs.com/package/@uuv/a11y)* : Pour effectuer des vérifications d'accessibilité rgaa _(développement en cours)_


- ### BDD : Behaviour Driven Development
  - *[Cucumber](https://cucumber.io/)* : Pour l'expression des cas d'usages dans un language compréhensible par tout humain


- ### Runners : Vous pouvez choisir entre
  - *[Cypress](https://www.cypress.io/)* -> [@uuv/cypress](https://www.npmjs.com/package/@uuv/cypress)
  - *[Playwright](https://playwright.dev/)* -> [@uuv/playwright](https://www.npmjs.com/package/@uuv/playwright)

- ### Serveur MCP (Model Context Protocol)
    - *[@uuv/mcp-server](./tools/uuv-mcp-server)* : Génération de tests pilotée par l'IA et intégration avec les LLM
      <br/>Génère automatiquement des scénarios Gherkin lisibles par un humain en utilisant OpenAI, Anthropic, Google ou Ollama

## Les avantages
- Si bien utilisé, intègre l’accessibilité dès le développement
- Une documentation vivante est possible car nous proposons un langage unifié pour les développeurs et les non-développeurs avec un [dictionnaire riche](category/step-definition) de phrases prêtes à l'emploi
- [@uuv/assistant](tools/uuv-assistant) pour écrire scénarios rapidement
- [Plugin JetBrains](tools/uuv-jetbrains-plugin) qui vous aide à écrire et à exécuter vos tests UUV E2E depuis les IDE JetBrains
- Intègre plusieurs moteurs d'exécution : Cypress / Playwright
- Rapport d’exécution user friendly et uniformisé([exemple](https://e2e-test-quest.github.io/kata-e2e-uuv/06-go-further/))

### Comparaison
|                      Criteria                       | Cypress | Playwright | Testing library | UUV |  
|:---------------------------------------------------:|:-: |:-: |:-: |:-: |  
|                    User centrism                    | :x: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  
|                Native accessibility                 | :x: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  
|        Easy setup configuration for BDD test        | :warning: | :warning: | :heavy_minus_sign: | :heavy_check_mark: |  
| Understandable by everyone <br/> (included non dev) | :x: | :x: | :x: | :heavy_check_mark: |  

### Exemple de syntaxe
Avec cet exemple de dom :
```html
  <body>
  <h1>Result<h1>
  </body>
```
on peut constater que la phrase proposée par **UUV est la plus compréhensible**<br/>

| Library         | Syntax                                                 |
|:----------------|:-------------------------------------------------------|
| Cypress         | <CodeBlock language="js">cy.get('h1').contains('Result')</CodeBlock>                       |
| Playwright      | <CodeBlock language="js">await expect(page.getByTitle('Result')).toHaveCount(1)</CodeBlock> |
| Testing library | <CodeBlock language="js">expect(screen.getByTitle(/Result/i)).toBeTruthy() </CodeBlock>     |
| UUV             | <CodeBlock language="gherkin">Alors Je dois voir un titre nommé "Result"</CodeBlock>          |
