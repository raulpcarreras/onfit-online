import type { Config } from 'jest';

const config: Config = {
  displayName: 'design-system',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testMatch: [
    '<rootDir>/components/**/__tests__/**/*.test.{ts,tsx}',
    '<rootDir>/components/**/*.test.{ts,tsx}',
    '<rootDir>/providers/**/__tests__/**/*.test.{ts,tsx}',
    '<rootDir>/providers/**/*.test.{ts,tsx}',
    '<rootDir>/lib/**/__tests__/**/*.test.{ts,tsx}',
    '<rootDir>/lib/**/*.test.{ts,tsx}',
  ],
  collectCoverageFrom: [
    '<rootDir>/components/**/*.{ts,tsx}',
    '<rootDir>/providers/**/*.{ts,tsx}',
    '<rootDir>/lib/**/*.{ts,tsx}',
    '!<rootDir>/components/**/*.native.{ts,tsx}',
    '!<rootDir>/providers/**/*.native.{ts,tsx}',
    '!<rootDir>/**/*.d.ts',
    '!<rootDir>/**/*.stories.{ts,tsx}',
  ],
  // coverageThreshold: {
  //   global: {
  //     branches: 10,
  //     functions: 15,
  //     lines: 10,
  //     statements: 10,
  //   },
  // },
  moduleNameMapper: {
    '^@repo/design/(.*)$': '<rootDir>/$1',
    '^@repo/(.*)$': '<rootDir>/../$1',
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
    }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
};

export default config;
