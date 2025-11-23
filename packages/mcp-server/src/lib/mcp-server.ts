import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createUUVServer } from "./mcp-server-factory";

const server = createUUVServer();
const transport = new StdioServerTransport();
server.connect(transport);
