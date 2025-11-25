
module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.(ts|tsx)$': ['babel-jest', {
      presets: ['next/babel'],
    }],
  },
  testMatch: ['**/__tests__/**/*.test.ts'],
};
