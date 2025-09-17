// eslint-disable-next-line @typescript-eslint/no-require-imports
const baseConfig = require("@tooling/jest/expo.config");

module.exports = {
    ...baseConfig,
    setupFilesAfterEnv: ["./__tests__/jest-setup.ts"],
};
