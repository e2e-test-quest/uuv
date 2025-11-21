# UUV MCP Server

This library is an MCP (Model Context Protocol) server for UUV - a solution to facilitate the writing and execution of E2E tests understandable by any human being(English or French) using cucumber(BDD) and cypress or playwright.

## Requirements
- Node.js 20
- Opencode, Claude Desktop, Goose or any other MCP client
- [Playwright MCP Server](https://github.com/microsoft/playwright-mcp)

## Exposed MCP Tools

This MCP server exposes the following tools:

### retrieve_prompt
- **Description**: Retrieve a uuv prompt template for a coding agent based on a prompt name and arguments.
- **Input Schema**:
  - `promptName` (enum): Either "generate_table" or "generate_role_and_name"
  - `baseUrl` (string): The base URL of the page
  - For generate_role_and_name:
    - `accessibleName` (string, optional): Accessible name 
    - `accessibleRole` (string, optional): Accessible role

### available_sentences
- **Description**: List all available UUV test sentences/phrases in Gherkin format.
- **Input Schema**:
  - `category` (enum, optional): Filters sentences by action type (general, keyboard, click, contains, type, checkable)
  - `role` (string, optional): Filters sentences related to an accessible role

### generate_role_and_name
- **Description**: Generate a complete UUV test scenario (Gherkin format) to verify the presence of an element with specified accessible name and role.
- **Input Schema**:
  - `baseUrl` (string): The base URL of the page where the element is located
  - `accessibleName` (string): Accessible name of the element
  - `accessibleRole` (string): Accessible role of the element

### generate_table
- **Description**: Generate a complete UUV test scenario (Gherkin format) to verify the presence and content of html table, grid or treegrid.
- **Input Schema**:
  - `baseUrl` (string): The base URL of the page where the table/grid/treegrid is located
  - `innerHtmlFilePath` (string): File path containing the raw innerHTML content

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

<summary>opencode</summary>

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

Use the Claude Code CLI to add the UUV MCP server:

```bash
claude mcp add uuv npx @uuv/mcp-server@latest
```
</details>
