const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['../../jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^uncrypto$': '<rootDir>/src/__mocks__/uncrypto.js',
    '^jose$': require.resolve('jose'),
    '^@auth0/nextjs-auth0/edge$': '<rootDir>/src/__mocks__/auth0-edge.js',
    '^next/server$': '<rootDir>/src/__mocks__/next-server.js',
  },
  testMatch: [
    '**/__tests__/**/*.test.ts',
    '**/__tests__/**/*.test.tsx',
    '**/?(*.)+(spec|test).ts',
    '**/?(*.)+(spec|test).tsx',
    '!**/e2e/**',
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(uncrypto|@upstash|uuid|jose|@auth0)/)',
  ],
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)
