# UUV MCP Server

This library is an MCP (Model Context Protocol) server for UUV - a solution to facilitate the writing and execution of E2E tests understandable by any human being(English or French) using cucumber(BDD) and cypress or playwright.

## Exposed MCP Tools

This MCP server exposes the following tools:

### 1. retrieve_prompt
- **Description**: Retrieve a uuv prompt template for a coding agent based on a prompt name and arguments.
- **Input Schema**:
  - `promptName` (enum): Either "generate_table" or "generate_role_and_name"
  - `baseUrl` (string): The base URL of the page
  - For generate_role_and_name:
    - `accessibleName` (string, optional): Accessible name 
    - `accessibleRole` (string, optional): Accessible role

### 2. available_sentences
- **Description**: List all available UUV test sentences/phrases in Gherkin format.
- **Input Schema**:
  - `category` (enum, optional): Filters sentences by action type (general, keyboard, click, contains, type, checkable)
  - `role` (string, optional): Filters sentences related to an accessible role

### 3. generate_role_and_name
- **Description**: Generate a complete UUV test scenario (Gherkin format) to verify the presence of an element with specified accessible name and role.
- **Input Schema**:
  - `baseUrl` (string): The base URL of the page where the element is located
  - `accessibleName` (string): Accessible name of the element
  - `accessibleRole` (string): Accessible role of the element

### 4. generate_table
- **Description**: Generate a complete UUV test scenario (Gherkin format) to verify the presence and content of html table, grid or treegrid.
- **Input Schema**:
  - `baseUrl` (string): The base URL of the page where the table/grid/treegrid is located
  - `innerHtmlFilePath` (string): File path containing the raw innerHTML content

## Command
Add the following command to execute **UUV MCP Server** `npx @uuv/mcp-server`.

### Opencode configuration example (opencode.json)
```json
...
  "mcp": {
    "playwright": {
      "type": "local",
      "enabled": true,
      "command": [
        "npx",
        "@uuv/mcp-server@latest"
      ]
    }
  }
...
```