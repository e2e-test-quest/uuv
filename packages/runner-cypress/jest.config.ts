/* eslint-disable */
export default {
  displayName: 'runner-cypress',
  preset: '../../jest.preset.js',
  testMatch: [
    '**/*/src/**/*.(spec|test).(js|ts)'
  ],
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  moduleNameMapper: {
    "@uuv/runner-commons/test": "<rootDir>/../runner-commons/src/tests/index.ts",
    "@uuv/runner-commons": "<rootDir>/../runner-commons/src/index.ts",
    "@uuv/dictionary": "<rootDir>/../dictionary/src/index.ts"
  },
  coverageDirectory: '../../coverage/packages/runner-cypress',
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
