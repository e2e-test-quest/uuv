export default {
    displayName: "mcp-server",
    preset: "../../jest.preset.js",
    testEnvironment: "node",
    transform: {
        "^.+\\.[tj]s$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.spec.json" }]
    },
    moduleFileExtensions: ["ts", "js", "html"],
    coverageDirectory: "../../coverage/packages/mcp-server",
    moduleNameMapper: {
        "@uuv/assistant": "<rootDir>/../assistant/src/index.ts",
        "@uuv/dictionary": "<rootDir>/../dictionary/src/index.ts",
    },
    reporters: [
        "default",
        [
            "jest-junit",
            {
                "outputDirectory": "./reports",
                "outputName": "junit-report.xml",
            }
        ]
    ]
};
