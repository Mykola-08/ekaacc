import nextJest from 'next/jest.js';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/../../jest.setup.js'],
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
    'node_modules/(?!(uncrypto|@upstash|uuid|jose|@auth0|@panva)/)',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
    '!src/**/*.test.{ts,tsx}',
  ],
};

export default createJestConfig(customJestConfig);
