# Development environment setup

This project was generated using [Nx](https://nx.dev).

## Prerequisites

- Node JS = 20.x.x
- Java 17

## Setup workspace

1. Retrieve sources
    ```shell
    git clone git@github.com:e2e-test-quest/uuv.git
    ```
2. Install dependencies
    ```shell
    npm install
    ```

## Projects

### a11y

A solution for automated accessibility validations

#### Main targets

| Target             | Description                    |
|--------------------|--------------------------------|
| `lint`             | Execute linter                 |
| `build`            | Build project                  |
| `dev`              | Build and watch project        |
| `test`             | Run all tests                  |
| `e2e-test:run`     | Run E2E tests in headless mode |
| `package`          | npm packaging                  |
| `semantic-release` | execute semantic release       |

### assistant

Tools that generate cucumber sentences for uuv tests scenarios

#### Main targets

| Target             | Description                                |
|--------------------|--------------------------------------------|
| `react:start`      | Launch assistant dev mode                  |
| `launch`           | Launch assistant from cli                  |
| `launch:custom`    | Launch assistant from cli with custom conf |
| `build`            | Build project                              |
| `test`             | Run all tests                              |
| `e2e-test:run`     | Run E2E tests in headless mode             |
| `e2e-test:open`    | Run E2E tests in headful mode              |
| `unit-tests`       | Run unit tests                             |
| `package`          | npm packaging                              |
| `semantic-release` | execute semantic release                   |

### assistant-electron

Assistant Wrapper for desktop

#### Main targets

| Target             | Description                        |
|--------------------|------------------------------------|
| `dev`              | Launch assistant-electron dev mode |
| `build`            | Build project                      |
| `semantic-release` | execute semantic release           |

### docs

Online documentation based on Docusaurus

#### Main targets

| Target             | Description                                          |
|--------------------|------------------------------------------------------|
| `start:en`         | Launch docs website in dev mode and english language |
| `start:fr`         | Launch docs website in dev mode and french language  |
| `clear`            | Clear docusaurus cache                               |
| `build`            | Build project                                        |
| `semantic-release` | execute semantic release                             |

### intellij-plugin

JetBrains Plugin that helps you execute and write your uuv E2E Tests.

#### Main targets

| Target             | Description                                            |
|--------------------|--------------------------------------------------------|
| `clear`            | Purge le cache docusaurus                              |
| `build`            | Build project                                          |
| `publish`          | Plugin current plugin version on Jetbrains Marketplace |
| `semantic-release` | execute semantic release                               |

### runner-commons

Components common to all runners, such as sentences and generators

#### Main targets

| Target             | Description              |
|--------------------|--------------------------|
| `lint`             | Execute linter           |
| `build`            | Build project            |
| `test`             | Run all tests            |
| `unit-tests`       | Run unit tests           |
| `package`          | npm packaging            |
| `semantic-release` | execute semantic release |

### runner-cypress

Cypress engine to execute UUV E2E Tests

#### Main targets

| Target             | Description                    |
|--------------------|--------------------------------|
| `lint`             | Execute linter                 |
| `build`            | Build project                  |
| `test`             | Run all tests                  |
| `e2e-test:run`     | Run E2E tests in headless mode |
| `e2e-test:open`    | Run E2E tests in headful mode  |
| `unit-tests`       | Run unit tests                 |
| `package`          | npm packaging                  |
| `semantic-release` | execute semantic release       |

### runner-playwright

Playwright engine to execute UUV E2E Tests

#### Main targets

| Target             | Description                    |
|--------------------|--------------------------------|
| `lint`             | Execute linter                 |
| `build`            | Build project                  |
| `test`             | Run all tests                  |
| `e2e-test:run`     | Run E2E tests in headless mode |
| `e2e-test:open`    | Run E2E tests in headful mode  |
| `unit-tests`       | Run unit tests                 |
| `package`          | npm packaging                  |
| `semantic-release` | execute semantic release       |

### vscode-extension

Vscode extension that helps you execute and write your uuv E2E Tests.

#### Main targets

| Target             | Description                    |
|--------------------|--------------------------------|
| `lint`             | Execute linter                 |
| `build`            | Build project                  |
| `test`             | Run all tests                  |
| `publish`          | publish                        |
| `semantic-release` | execute semantic release       |

## Useful information

### Show available projects

```shell
npx nx show projects
```

### Show project dependency graph

```shell
npx nx graph
```

### Display available tasks for a project

For example, to show the available tasks for the project `runner-cypress`
```shell
npx nx show project runner-cypress --json false
```

### Run a target for a project

For example, to run the target `myCommand` for the project `runner-cypress`

```shell
npx nx myCommand runner-cypress
```

### Run a target for all projects

For example, to run the `myCommand` for project

```shell
npx nx run-many --all --target=myCommand
```

### Add dependency to a project

For example, to add the `dependencyName` package to the `runner-playwright` project

```shell
npm install dependencyName --workspace=packages/runner-playwright
```
