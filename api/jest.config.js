/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.ts"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  globalSetup: "./testSetup.ts",
  transform: {
    "^.+\\.ts$": ["ts-jest"]
  }
};
