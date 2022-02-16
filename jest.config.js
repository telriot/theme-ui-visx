const nextJest = require('next/jest');
// Providing the path to your Next.js app which will enable loading next.config.js and .env files
const createJestConfig = nextJest({ dir: './' });
// Any custom config you want to pass to Jest
const customJestConfig = {
  // add test-utils direct import
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
  preset: 'ts-jest',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleDirectories: ['node_modules', 'test', '<rootDir>/'],
  moduleNameMapper: {
    'src/(.*)': '<rootDir>/src/$1',
  },
  // add jest-dom and emotion's extra matchers
  setupFilesAfterEnv: ['<rootDir>/test/jest.setup.js'],
  snapshotSerializers: ['@emotion/jest/serializer'],
  // coverage
  collectCoverageFrom: ['<rootDir>/src/**/*.{ts,tsx,js,jsx}'],
  // ignore cypress folder
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/cypress/'],
  // jest 27 introduced 'node' as new default `testEnvironment`
  // this can be set on a per-file basis: https://jestjs.io/docs/configuration#testenvironment-string
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(tsx|ts)$',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
};
module.exports = createJestConfig(customJestConfig);
