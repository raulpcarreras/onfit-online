#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// Get the environment argument
const validEnvs = ["staging", "production", "development", "simulator"];
const env = process.argv[2] ?? "development";

// Check if this is an EAS build
const isEasBuild = process.env.EAS_BUILD === "true" || process.argv.includes("--eas");

if (isEasBuild) {
    // Prepare package.json for EAS
    const prepareEasScript = path.join(__dirname, "prepare-eas.js");
    if (fs.existsSync(prepareEasScript)) {
        execSync(`node ${prepareEasScript}`, { stdio: "inherit" });
    }
}

if (!env || !validEnvs.includes(env)) {
    console.error(`Please provide a valid environment: ${validEnvs.join(", ")}`);
    process.exit(1);
}

// Map environments to their corresponding settings
const envSettings = {
    production: { appEnv: "production", easEnv: "production" },
    staging: { appEnv: "development", easEnv: "staging" },
    development: { appEnv: "development", easEnv: "development" },
    simulator: { appEnv: "development", easEnv: "simulator" },
};

const { appEnv, easEnv } = envSettings[env];
const additionalArgs = process.argv.slice(3).join(" ");

// For development, use expo prebuild instead of eas build
let command;
if (env === "development") {
    command = `cross-env APP_ENV=${appEnv} EXPO_NO_DOTENV=1 expo prebuild --clean`;
} else {
    command = `cross-env APP_ENV=${appEnv} EXPO_NO_DOTENV=1 eas build -e ${easEnv} ${additionalArgs}`;
}

try {
    console.log(`Executing command for ${env} environment:`);
    console.log(command);
    execSync(command, { stdio: "inherit" });
} catch (error) {
    // Log the entire error object to understand its structure
    console.error("Error executing command:", error);

    // Try accessing other properties or error output as fallback
    const errorMessage = error?.message || error.toString() || "Unknown error";
    console.error(`Build failed: ${errorMessage}`);
    process.exit(1);
}
