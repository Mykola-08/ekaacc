const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Point to the web app directory inside monorepo
  dir: './apps/web',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/apps/web/src/$1',
    '^uncrypto$': '<rootDir>/apps/web/src/__mocks__/uncrypto.js',
  },
  testMatch: [
    '**/__tests__/**/*.test.ts',
    '**/__tests__/**/*.test.tsx',
    '**/?(*.)+(spec|test).ts',
    '**/?(*.)+(spec|test).tsx',
    '!**/e2e/**', // Exclude e2e tests (run with Playwright)
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(uncrypto|@upstash|uuid)/)',
  ],
  transform: {
    '^.+\\.(ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverageFrom: [
    'apps/web/src/**/*.{ts,tsx}',
    '!apps/web/src/**/*.d.ts',
    '!apps/web/src/**/__tests__/**',
    '!apps/web/src/**/*.test.{ts,tsx}',
  ],
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)