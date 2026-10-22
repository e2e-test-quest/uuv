/* eslint-disable */
export default {
  displayName: 'runner-playwright',
  preset: '../../jest.preset.js',
  testMatch: [
    '**/*/src/**/*.(spec|test).(js|ts)'
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(?:@cucumber/gherkin|@cucumber/gherkin-utils|@cucumber/messages|@cucumber/tag-expressions)/)',
  ],
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  moduleNameMapper: {
    "@uuv/runner-commons/test": "<rootDir>/../runner-commons/src/tests/index.ts",
    "@uuv/runner-commons": "<rootDir>/../runner-commons/src/index.ts",
    "@uuv/dictionary": "<rootDir>/../dictionary/src/index.ts",
    "^figlet$": "<rootDir>/../../__mocks__/figlet.ts"
  },
  coverageDirectory: '../../coverage/packages/runner-playwright',
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
