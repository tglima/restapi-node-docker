module.exports = {
  clearMocks: true,

  collectCoverage: true,

  collectCoverageFrom: ['<rootDir>/src/app/**/*.js'],

  coverageDirectory: '__tests__/coverage',

  coverageReporters: ['text-summary', 'lcov'],

  testEnvironment: 'node',

  testMatch: ['**/__tests__/**/*.test.js'],

  transform: {
    '.(js|jsx|ts|tsx)': '@sucrase/jest-plugin',
  },

  // Define o tempo máximo de timeout para cada teste para 10 segundos.
  testTimeout: 10000,

  globalSetup: './__tests__/utils/setup.js',
  globalTeardown: './__tests__/utils/teardown.js',
};
