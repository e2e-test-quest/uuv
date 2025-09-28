import { mcpServer } from "./mcp-server";

describe("mcpServer", () => {
    it("should work", () => {
        expect(mcpServer()).toEqual("mcp-server");
    });
});
