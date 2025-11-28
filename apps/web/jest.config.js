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
    '^next/server$': '<rootDir>/src/__mocks__/next-server.js',
  },
  testMatch: [
    '**/__tests__/**/*.test.ts',
    '**/__tests__/**/*.test.tsx',
    '**/?(*.)+(spec|test).ts',
    '**/?(*.)+(spec|test).tsx',
    '!**/e2e/**',
  ],
  modulePathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules_trash/',
    '<rootDir>/../../node_modules_trash/',
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(uncrypto|@upstash|uuid|jose|@panva)/)',
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
