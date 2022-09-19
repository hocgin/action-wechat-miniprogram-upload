module.exports = {
    clearMocks: true,
    moduleFileExtensions: ['js', 'ts'],
    testEnvironment: 'node',
    testMatch: ['**/*.test.ts'],
    transform: {
        "\\.[jt]sx?$": "babel-jest",
    },
    verbose: true,
};
