import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Installation

:::info[✨ Nouveau : Génération de tests avec l'IA(MCP)]
Démarrez encore plus vite avec **[@uuv/mcp-server](/docs/tools/uuv-mcp-server)** - la solution IA qui génère automatiquement des scénarios Gherkin lisibles par un humain ! Intégrez des LLM comme OpenAI, Anthropic et Google pour explorer votre application et générer des tests E2E accessibles en quelques minutes.
:::

:::warning[Configurations requises]

- Node.js 18+ ([Regarder ici comment installer Node.js et Npm](https://kinsta.com/blog/how-to-install-node-js/#how-to-install-nodejs-and-npm))
- Npm/Yarn aura besoin d'accéder à internet lors de l'installation de la librairie
- Un de ces systèmes d'exploitation : - Windows 10+, Windows Server 2016+ ou Windows Subsystem for Linux (WSL). - MacOS 12 Monterey, MacOS 13 Ventura, ou MacOS 14 Sonoma. - Debian 11, Debian 12, Ubuntu 20.04 ou Ubuntu 22.04, avec l'architecture x86-64 ou arm64.
  :::

## Introduction

Vous pouvez choisir parmi les runners suivants :
- [@uuv/cypress](#installer-uuvcypress)
- [@uuv/playwright](#installer-uuvplaywright)

Lorsque vos tests sont écrits vous pouvez changer de runner sans avoir à les modifier.

## Installer @uuv/cypress

Exécuter la commande suivante :

<Tabs>
<TabItem value="npm" label="Npm">

```shell
npm install --save-dev @uuv/cypress
```

</TabItem>
<TabItem value="Yarn" label="Yarn">

```shell
yarn add -D @uuv/cypress
```

</TabItem>
</Tabs>

### Ce qui est installé
```
uuv/
  cypress.config.ts
  cypress/
    support/
      command.ts
.cypress-cucumber-preprocessorrc.json  
```

## Installer @uuv/playwright

Exécuter la commande suivante :

<Tabs>
<TabItem value="npm" label="Npm">

```shell
npm install --save-dev @uuv/playwright
```

</TabItem>
<TabItem value="Yarn" label="Yarn">

```shell
yarn add -D @uuv/playwright
```

</TabItem>
</Tabs>

### Ce qui est installé
```
uuv/
  playwright.config.ts
cucumber.cjs
```
