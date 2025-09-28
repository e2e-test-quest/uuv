export default {
    displayName: "mcp-server",
    preset: "../../jest.preset.js",
    testEnvironment: "node",
    transform: {
        "^.+\\.[tj]s$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.spec.json" }]
    },
    moduleNameMapper: {
        "@uuv/assistant": "<rootDir>/../assistant/src/index.ts"
    },
    moduleFileExtensions: ["ts", "js", "html"],
    coverageDirectory: "../../coverage/packages/mcp-server",
};
