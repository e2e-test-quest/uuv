import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Installation

:::info[✨ New: AI-Powered Test Generation with MCP]
Get started even faster with **[@uuv/mcp-server](/docs/tools/uuv-mcp-server)** - the AI-driven solution that automatically generates human-readable Gherkin test scenarios! Integrate LLMs like OpenAI, Anthropic, and Google to explore your app and generate accessible E2E tests in minutes.
:::

:::warning[System requirements]

- Node.js 18+ ([See here how to install Node.js and Npm](https://kinsta.com/blog/how-to-install-node-js/#how-to-install-nodejs-and-npm))
- Npm/Yarn will need access to the internet when installing the library
- One of these OS :
    - Windows 10+, Windows Server 2016+ or Windows Subsystem for Linux (WSL).
    - MacOS 12 Monterey, MacOS 13 Ventura, or MacOS 14 Sonoma.
    - Debian 11, Debian 12, Ubuntu 20.04 or Ubuntu 22.04, with x86-64 or arm64 architecture.
      :::

## Introduction

You can choose among the following runners :

- [@uuv/cypress](#installing-uuvcypress)
- [@uuv/playwright](#installing-uuvplaywright)

When your tests are written you can change the runner by replacing the npm dependency without having to modify them.

## Installing @uuv/cypress

Run the following command :

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

### What's installed

```
uuv/
  cypress.config.ts
  cypress/
    support/
      command.ts
.cypress-cucumber-preprocessorrc.json
```

## Installing @uuv/playwright

Run the following command :

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

### What's installed

```
uuv/
  playwright.config.ts
cucumber.cjs
```
