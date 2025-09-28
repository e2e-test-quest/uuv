/* eslint-disable */
export default {
  displayName: 'assistant',
  preset: '../../jest.preset.js',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.test.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  modulePathIgnorePatterns: ["uuv/.uuv-features-gen"],
  coverageDirectory: '../../coverage/packages/assistant',
  moduleNameMapper: {
    "@uuv/dictionary": "<rootDir>/../dictionary/src/index.ts"
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
