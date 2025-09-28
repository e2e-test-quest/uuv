export default {
    displayName: "sentences",
    preset: "../../jest.preset.js",
    transform: {
        "^.+\\.[tj]s$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.spec.json" }],
    },
    moduleFileExtensions: ["ts", "js", "html"],
    coverageDirectory: "../../coverage/packages/sentences",
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
