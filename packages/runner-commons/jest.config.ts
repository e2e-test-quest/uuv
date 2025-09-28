/* eslint-disable */
export default {
  displayName: 'runner-commons',
  preset: '../../jest.preset.js',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/packages/runner-commons',
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
