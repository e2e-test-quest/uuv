# UUV MCP Server

This library is an MCP (Model Context Protocol) server for UUV - a solution to facilitate the writing and execution of E2E tests understandable by any human being(English or French) using cucumber(BDD) and cypress or playwright.

## Requirements
- Node.js 20
- Opencode, Claude Desktop, Goose or any other MCP client
- [Playwright MCP Server](https://github.com/microsoft/playwright-mcp)

## Getting started

First, install the UUV MCP server with your client.

**Standard config** works in most of the tools:

```js
{
  "mcpServers": {
    "uuv": {
      "command": "npx",
      "args": [
        "@uuv/mcp-server@latest"
      ]
    }
  }
}
```

<summary>Opencode</summary>

Follow the MCP Servers [documentation](https://opencode.ai/docs/mcp-servers/). For example in `~/.config/opencode/opencode.json`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "uuv": {
      "type": "local",
      "command": [
        "npx",
        "@uuv/mcp-server@latest"
      ],
      "enabled": true
    }
  }
}

```


</details>

<summary>Claude Code</summary>

Use the Claude Code CLI to add the Marketplace plugin for the UUV:
```bash
claude plugin marketplace add https://github.com/e2e-test-quest/uuv
```

Then use the Claude Code CLI to add specific UUV's plugin:

```bash
claude plugin install uuv-e2e-accessibility-test@uuv-e2e-accessibility-test-marketplace
```

Then use the Claude Code CLI to add the UUV MCP server:

```bash
claude mcp add uuv npx @uuv/mcp-server@latest
```

</details>


<summary>Gemini CLI</summary>

To **add** the UUV Extension:

```bash
gemini extensions install https://github.com/e2e-test-quest/uuv --auto-update
```

To **remove** the UUV Extension:

```bash
gemini extensions uninstall uuv-e2e-accessibility-test
```

</details>

## Exposed MCP Tools

This MCP server exposes the following tools:

### retrieve_prompt
- **Description**: Retrieve an uuv prompt template for a coding agent based on a prompt name and arguments.
- **Input Schema**:
  - `promptName` (enum): Either `generate_test_expect_table`, `generate_test_expect_element`, `generate_test_click_element`, `generate_test_within_element` or `generate_test_type_element`
  - `baseUrl` (string): The base URL of the page
  - For `generate_test_expect_table`, `generate_test_expect_element`, `generate_test_click_element`, `generate_test_within_element` or `generate_test_type_element`:
    - `accessibleName`: (string, optional): Accessible name
    - `accessibleRole`: (string, optional): Accessible role
    - `domSelector`: Dom selector of the element

### available_sentences
- **Description**: List all available UUV test sentences/phrases in Gherkin format.
- **Input Schema**:
  - `category` (enum, optional): Filters sentences by action type (general, keyboard, click, contains, type, checkable)
  - `role` (string, optional): Filters sentences related to an accessible role

### generate_test_expect_element
- **Description**: Generate a complete UUV test scenario (Gherkin format) to verify the presence of an element with specified (role and name) or domSelector.
- **Input Schema**:
  - `baseUrl` (string): The base URL of the page where the element is located
  - `accessibleName` (string): Accessible name of the element
  - `accessibleRole` (string): Accessible role of the element
  - `domSelector`: Dom selector of the element

### generate_test_expect_element
- **Description**: Generate a complete UUV test scenario (Gherkin format) to verify the presence of an element with specified (role and name) or domSelector.
- **Input Schema**:
  - `baseUrl` (string): The base URL of the page where the element is located
  - `accessibleName` (string): Accessible name of the element
  - `accessibleRole` (string): Accessible role of the element
  - `domSelector`: Dom selector of the element

### generate_test_click_element
- **Description**: Generate a complete UUV test scenario (Gherkin format) that clicks on html element with specified (role and name) or domSelector.
- **Input Schema**:
  - `baseUrl` (string): The base URL of the page where the element is located
  - `accessibleName` (string): Accessible name of the element
  - `accessibleRole` (string): Accessible role of the element
  - `domSelector`: Dom selector of the element

### generate_test_type_element
- **Description**: Generate a complete UUV test scenario (Gherkin format) that focus within a html element with specified (role and name) or domSelector.
- **Input Schema**:
  - `baseUrl` (string): The base URL of the page where the element is located
  - `accessibleName` (string): Accessible name of the element
  - `accessibleRole` (string): Accessible role of the element
  - `domSelector`: Dom selector of the element

### generate_test_expect_table
- **Description**: Generate a complete UUV test scenario (Gherkin format) to verify the presence and content of html table, grid or treegrid.
- **Input Schema**:
  - `baseUrl` (string): The base URL of the page where the table/grid/treegrid is located
  - `innerHtmlFilePath` (string): File path containing the raw innerHTML content


## Exposed MCP Prompts

This MCP server exposes the following prompts:

### generate_test_expect_element
- **Description**: Returns UUV prompt to verify the presence of an element with specified (role and name) or domSelector.
- **Input Schema**:
  - `baseUrl` (string): The base URL of the page where the element is located
  - `accessibleName` (string): Accessible name of the element
  - `accessibleRole` (string): Accessible role of the element
  - `domSelector`: Dom selector of the element

### generate_test_expect_element
- **Description**: Returns UUV prompt to verify the presence of an element with specified (role and name) or domSelector.
- **Input Schema**:
  - `baseUrl` (string): The base URL of the page where the element is located
  - `accessibleName` (string): Accessible name of the element
  - `accessibleRole` (string): Accessible role of the element
  - `domSelector`: Dom selector of the element

### generate_test_click_element
- **Description**: Returns UUV prompt that clicks on html element with specified (role and name) or domSelector.
- **Input Schema**:
  - `baseUrl` (string): The base URL of the page where the element is located
  - `accessibleName` (string): Accessible name of the element
  - `accessibleRole` (string): Accessible role of the element
  - `domSelector`: Dom selector of the element

### generate_test_type_element
- **Description**: Returns UUV prompt that focus within a html element with specified (role and name) or domSelector.
- **Input Schema**:
  - `baseUrl` (string): The base URL of the page where the element is located
  - `accessibleName` (string): Accessible name of the element
  - `accessibleRole` (string): Accessible role of the element
  - `domSelector`: Dom selector of the element

### generate_test_expect_table
- **Description**: Generate a complete UUV test scenario (Gherkin format) to verify the presence and content of html table, grid or treegrid.
- **Input Schema**:
  - `baseUrl` (string): The base URL of the page where the table/grid/treegrid is located
  - `innerHtmlFilePath` (string): File path containing the raw innerHTML content