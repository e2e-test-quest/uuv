# Description of UUV MCP-SERVER Package

I've successfully completed a comprehensive exploration of the `/workspaces/opensource/uuv/packages/mcp-server/` package. Here's what I've discovered:

## 📦 Package Overview

**@uuv/mcp-server** is a Model Context Protocol (MCP) server that bridges AI models with end-to-end testing capabilities. It enables AI assistants to generate **human-readable Gherkin test scenarios** for web applications using BDD and either Playwright or Cypress.

## 🎯 Purpose
The package serves three main functions:
1. **AI-Powered Test Generation** - Generates Gherkin/Cucumber scenarios from natural language
2. **Accessibility-First Design** - Tests using ARIA roles and names
3. **Framework Agnostic** - Works with Playwright and Cypress

## 📋 MCP Tools Implemented (13 tools):

**Query Tools:**
- `getBaseUrl` - Retrieves project base URL from environment or config files
- `availableSentences` - Lists available UUV test sentences with optional filtering

**Element Test Generation Tools:**
- `genTestExpectRoleAndName` - Verify element presence via ARIA roles
- `genTestExpectDomSelector` - Verify element presence via CSS selectors
- `genTestClickRoleAndName` - Click elements via ARIA
- `genTestClickDomSelector` - Click elements via CSS selectors
- `genTestTypeRoleAndName` - Type into form fields via ARIA
- `genTestWithinRoleAndName` - Focus within elements via ARIA
- `genTestWithinDomSelector` - Focus within elements via CSS
- `genTestExpectTable` - Verify table/grid/treegrid content

**Smart/Experimental Tools:**
- `genNominalTestCase` - AI-driven exploration for happy path tests (uses browser automation)

**Utility Tools:**
- `installUuvDependency` - Installs @uuv/playwright package
- `checkUuvDependency` - Checks installation status
- `getUuvVersion` - Gets package version

## 🏗️ Architecture Pattern

**Service Layer Pattern:**
```
MCP Server Factory (Entry Point)
    ↓
Prompt Retriever Service (Mustache template system)
    ↓
Element Services (Polymorphic abstraction)
    ├── AbstractElementService (Base class)
    ├── ClickElementService
    ├── TypeElementService
    ├── WithinElementService
    ├── ExpectElementService
    └── GeneralElementService
```

**Key Design Patterns:**
1. **Polymorphic Element Services** - Abstract base class with concrete implementations for different actions
2. **Template-Based Prompting** - Mustache templates stored in `src/lib/prompts/`
3. **Zod Validation** - Strong TypeScript with Zod-based input validation
4. **MCP Protocol Integration** - Uses `@modelcontextprotocol/sdk` for tool/prompt registration

## 🛠️ API Patterns

**Input/Output Schema:**
```typescript
z.object({
    baseUrl: z.string().describe(...),
    accessibleRole: z.string().optional().describe(...),
    accessibleName: z.string().optional().describe(...)
})
```

**Tool Registration Pattern:**
```typescript
server.registerTool(
    TOOL_NAME,
    {
        title: "...",
        description: "...",
        inputSchema: Schema
    },
    async ({ params }) => {
        return {
            content: [{ type: "text", text: result }]
        };
    }
);
```

## 🎓 How New MCP Tools Should Be Integrated

**Requirements:**
1. Add enum constant to `UUV_MCP_SERVER_ITEM`
2. Define schema in `prompt-retriever.service.ts`
3. Register tool in `mcp-server-factory.ts` following the established pattern
4. Create prompt template in `src/lib/prompts/` directory
5. Implement corresponding service in `services/element/` or use existing services

## 📁 Key Implementation Files

**Entry Points:**
- `src/index.ts` - Main entry point
- `src/lib/mcp-server.ts` - Server initialization
- `src/lib/mcp-server-factory.ts` - Tool/prompt registration logic

**Services:**
- `src/lib/services/prompt-retriever.service.ts` - Template management and Zod validation
- `src/lib/services/expect.service.ts` - Service factory for element services
- `src/lib/services/element/abstract-element.service.ts` - Base class for element operations

## 🔧 Build & Test Patterns

**Build Command:**
```bash
npx nx build mcp-server
# Runs build-tsc + build-copy-prompt-templates
```

**Test Command:**
```bash
npx nx test mcp-server
# Uses Jest with coverage
```

**Lint Command:**
```bash
npx nx lint mcp-server
```

## 🧪 Dependencies & Environment

**Core Dependencies:**
- `@modelcontextprotocol/sdk` - MCP protocol implementation
- `zod` - Schema validation
- `@uuv/assistant` - Core UUV functionality
- `@uuv/dictionary` - Sentence dictionary
- `mustache` - Template rendering
- `pino` - Logging

**Required Environment Variables:**
- `UUV_LLM_MODEL` - LLM provider/model (e.g., "anthropic/claude-sonnet-4-6")
- `UUV_LLM_API` (optional) - Ollama API endpoint
- `UUV_JSON_FLAT_MODEL_ENABLED` (recommended for Anthropic/Gemini) - JSON output format

## ⚠️ Technical Debt Observations

1. **Inconsistent Zod schemas** - Some tools use inline schemas, some use exported const objects
2. **Incomplete type safety** - `PromptExtraArgs` uses `any` type
3. **TODO comments** - Several areas marked for improvement in factory.ts
4. **Missing documentation** - Some descriptions could be more comprehensive

## 📖 Remaining Work for Complete Analysis

To complete a full architectural analysis, I would need to examine:
- `src/lib/services/sentence.service.ts` - How test sentences are structured and filtered
- `src/lib/services/dependencies.service.ts` - Installation and version checking logic
- `src/lib/services/architect/architect.service.ts` - AI-driven exploration mechanism
- `src/lib/services/general.service.ts` - Utility functions
- Sample prompt templates in `src/lib/prompts/`

## 🎯 Key Takeaways

1. **Clean MCP implementation** - Well-structured tool registration and prompts
2. **Extensible service model** - Easy to add new element action types
3. **Multi-language sentence structure** - Supports English/French test sentences
4. **Accessibility-first** - Strong emphasis on ARIA roles and semantic HTML
5. **Two-generation modes** - Targeted (parameters) vs. smart (exploration) testing approaches

---

**Recommendation for Next Steps:**
If you want to add new MCP tools, start by examining the existing tool registration patterns in `mcp-server-factory.ts`, then follow the pattern of implementing a service in the `services/element/` directory, and create a corresponding prompt template in the `prompts/` directory.