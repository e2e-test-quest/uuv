# UUV MCP Server

## Introduction
`@uuv/mcp-server` is a Model Context Protocol (MCP) server for UUV — a solution that facilitates the writing and execution of end-to-end (E2E) tests understandable by any human being (English or French) using Cucumber (BDD) and Playwright or Cypress.

As an MCP server, `@uuv/mcp-server` acts as a bridge between AI models and E2E testing capabilities. It enables AI assistants to generate human-readable Gherkin test scenarios for web applications, supporting both English and French languages. The server integrates with popular LLM providers (OpenAI, Anthropic, Google, Ollama) to provide AI-driven test generation and validation.

### Key Benefits
- **AI-Powered Test Generation**: Automatically generates Gherkin scenarios from natural language descriptions
- **Accessibility-First**: Tests are designed with accessibility in mind using ARIA roles and names
- **Framework Agnostic**: Works with Playwright and Cypress
- **BDD Compliance**: Uses Gherkin syntax for clear, readable test specifications
- **Multi-Language Support**: Test scenarios can be written in English or French

## Setup

### Requirements
- **Node.js 20 or higher**

### Supported LLMs

`@uuv/mcp-server` supports the following LLM providers:

- **OpenAI**: `openai/gpt-4.1`, `openai/gpt-3.5-turbo`, etc.
- **Anthropic**: `anthropic/claude-haiku-4-5`, `anthropic/claude-sonnet-4-6`, etc.
- **Google**: `google/gemini-2.0-flash`, `google/gemini-pro`, etc.
- **Ollama**: `ollama/qwen3-coder-next`, `ollama/llama3`, etc.

### MCP Configuration
#### Standard MCP Configuration

```json
{
    "mcpServers": {
        "uuv": {
            "command": "npx",
            "args": ["@uuv/mcp-server@latest"],
            "env": {
                "UUV_LLM_MODEL": "anthropic/claude-haiku-4-5",
                "UUV_JSON_FLAT_MODEL_ENABLED": true
            }
        }
    }
}
```

#### Opencode Configuration

```json
{
    "$schema": "https://opencode.ai/config.json",
    "mcp": {
        "uuv": {
            "type": "local",
            "command": ["npx", "@uuv/mcp-server@latest"],
            "enabled": true,
            "timeout": 300000,
            "environment": {
                "UUV_LLM_MODEL": "anthropic/claude-sonnet-4-6"
            }
        }
    }
}
```

For a dedicated agent configuration, see: [uuv-assistant.md](./01-uuv-assistant.md)

#### Claude Code Configuration

Add the UUV MCP server via CLI:

```bash
claude mcp add uuv npx @uuv/mcp-server@latest
```

#### Gemini CLI Configuration

```bash
gemini extensions install https://github.com/e2e-test-quest/uuv --auto-update
```

---



#### Environment Variables

| Environment Variable          | Required                                  | Description                                                                                |
| ----------------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------ |
| `UUV_LLM_MODEL`               | Yes                                       | Specifies the LLM model used by the MCP server. Format: `<provider>/<modelName>`           |
| `UUV_JSON_FLAT_MODEL_ENABLED` | Recommended (`true` for Anthropic/Gemini) | Enables flat JSON output formatting (strongly recommended for Anthropic and Gemini models) |
| `UUV_LLM_API`                 | Optional (Ollama only)                    | Base API endpoint for local Ollama models                                                  |

## Usage (MCP Prompts)

### Two generation modes: smart exploration vs. targeted generation

The `@uuv/mcp-server` offers two complementary approaches to generate your e2e tests.

---

### 🔍 Prompts with automatic application exploration

These two prompts are unique: **they actually navigate your application** to understand its structure before generating tests. No more manual parameters to fill in — the AI explores, analyzes, and produces scenarios tailored to your real interface.

| Template | Purpose | Key Parameters |
|---|---|---|
| `genNominalTestCase` | Generates a full test scenario (happy path) by exploring the app | `testCase` |
| `genTestExpectTable` | Verifies table content by inspecting real data | `baseUrl`, `innerHtmlFilePath` |

**Why is this powerful?** Rather than describing what you want to test, you simply describe your intent — the MCP server takes care of exploring your application, identifying relevant elements, and generating a test that matches your actual interface.

---

### ⚡ Targeted generation prompts

These prompts generate precise tests from parameters you provide. Perfect for specific use cases when you know exactly which element to target.

| Template | Purpose | Key Parameters |
|---|---|---|
| `installUuvDependency` | Install @uuv/playwright | — |
| `checkUuvDependency` | Check installation status | — |
| `getUuvVersion` | Get package version | — |
| `genTestClickRoleAndName` | Click an element via ARIA | `accessibleName`, `accessibleRole` |
| `genTestClickDomSelector` | Click an element via CSS selector | `domSelector` |
| `genTestTypeRoleAndName` | Type into a field | `accessibleName`, `accessibleRole` |
| `genTestExpectDomSelector` | Verify element existence (CSS) | `domSelector` |
| `genTestExpectRoleAndName` | Verify element existence (ARIA) | `accessibleName`, `accessibleRole` |
| `genTestWithinRoleAndName` | Focus within an element (ARIA) | `accessibleName`, `accessibleRole` |
| `genTestWithinDomSelector` | Focus within an element (CSS) | `domSelector` |

All these prompts follow a consistent three-step pattern:
1. Retrieve the base URL via `uuv_getBaseUrl`
2. Generate the test with the appropriate `uuv_gen*` tool
3. Write the `.feature` file to `./uuv/e2e`

---

### Examples

**Verify element presence** — `genTestExpectRoleAndName`
- `baseUrl`: `https://example.com`
- `accessibleRole`: `button`
- `accessibleName`: `Login`

**Click an element** — `genTestClickRoleAndName`
- `baseUrl`: `https://example.com`
- `accessibleRole`: `link`
- `accessibleName`: `Products`

**Type into a form field** — `genTestTypeRoleAndName`
- `baseUrl`: `https://example.com`
- `accessibleRole`: `textbox`
- `accessibleName`: `Search`
- `value`: `laptop`

## MCP Tools

This MCP server exposes the following tools:

### getBaseUrl

- **Description**: Retrieve project base url for generated UUV tests. In terms of priority, the UUV_BASE_URL environment variable is read, and if it is empty, the value of the baseURL field in the projectPath/uuv/playwright.config.ts or projectPath/uuv/cypress.config.ts file is checked.
- **Input Schema**:
    - `projectPath` (string): Project absolute path

### availableSentences

- **Description**: List all available UUV test sentences/phrases in Gherkin format.
- **Input Schema**:
    - `category` (enum, optional): Filters sentences by action type (general, keyboard, click, contains, type, checkable)
    - `role` (string, optional): Filters sentences related to an accessible role

### genTestExpectRoleAndName

- **Description**: Generate a complete UUV test scenario (Gherkin format) to verify the presence of an element with specified role and name.
- **Input Schema**:
    - `baseUrl` (string): The base URL of the page where the element is located
    - `accessibleRole` (string): Accessible role of the element
    - `accessibleName` (string): Accessible name of the element

### genTestExpectDomSelector

- **Description**: Generate a complete UUV test scenario (Gherkin format) to verify the presence of an element with specified domSelector.
- **Input Schema**:
    - `baseUrl` (string): The base URL of the page where the element is located
    - `domSelector` (string): Dom selector of the element

### genTestClickRoleAndName

- **Description**: Generate a complete UUV test scenario (Gherkin format) that clicks on html element with specified role and name.
- **Input Schema**:
    - `baseUrl` (string): The base URL of the page where the element is located
    - `accessibleRole` (string): Accessible role of the element
    - `accessibleName` (string): Accessible name of the element

### genTestClickDomSelector

- **Description**: Generate a complete UUV test scenario (Gherkin format) that clicks on html element with specified domSelector.
- **Input Schema**:
    - `baseUrl` (string): The base URL of the page where the element is located
    - `domSelector` (string): Dom selector of the element

### genTestWithinRoleAndName

- **Description**: Generate a complete UUV test scenario (Gherkin format) that focus within a html element with specified role and name.
- **Input Schema**:
    - `baseUrl` (string): The base URL of the page where the element is located
    - `accessibleRole` (string): Accessible role of the element
    - `accessibleName` (string): Accessible name of the element

### genTestWithinDomSelector

- **Description**: Generate a complete UUV test scenario (Gherkin format) that focus within a html element with specified domSelector.
- **Input Schema**:
    - `baseUrl` (string): The base URL of the page where the element is located
    - `domSelector` (string): Dom selector of the element

### genTestTypeRoleAndName

- **Description**: Generate a complete UUV test scenario (Gherkin format) that types a value into an html element with specified role and name.
- **Input Schema**:
    - `baseUrl` (string): The base URL of the page where the element is located
    - `accessibleRole` (string): Accessible role of the element
    - `accessibleName` (string): Accessible name of the element

### genTestExpectTable (Experimental)

- **Description**: Generate a complete UUV test scenario (Gherkin format) to verify the presence and content of html table, grid or treegrid.
- **Input Schema**:
    - `baseUrl` (string): The base URL of the page where the table/grid/treegrid is located
    - `innerHtmlFilePath` (string): File path containing the raw innerHTML content

### genNominalTestCase (Experimental)

Supported LLM provider are openai, anthropic, google and ollama

- **Description**: Generate a complete UUV test scenario (Gherkin format) for the nominal case using AI-driven browser exploration with Playwright tools.
- **Input Schema**:
    - `testCase` (string): Brief description of the test scenario to be generated

### installUuvDependency

- **Description**: Install @uuv/playwright npm package.
- **Input Schema**:
    - `projectPath` (string): Path to the project directory
    - `packageName` (string, optional): Optional package name to install (default: @uuv/playwright)

### checkUuvDependency

- **Description**: Check if @uuv/playwright is installed.
- **Input Schema**:
    - `projectPath` (string): Path to the project directory

### getUuvVersion

- **Description**: Get the current version of @uuv/playwright npm package.
- **Input Schema**:
    - `projectPath` (string): Path to the project directory

