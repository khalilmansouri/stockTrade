const tsconfig = require("./tsconfig.json")
const moduleNameMapper = require("tsconfig-paths-jest")(tsconfig)

module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/build/'],
    testMatch: [
        "**/*.spec.[jt]s"
    ],
    reporters: ["default"],
    setupFilesAfterEnv: ["jest-extended"],
    moduleNameMapper,
};
