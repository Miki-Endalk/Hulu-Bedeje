import dotenv from "dotenv";

// Load test environment variables
dotenv.config({path: ".env.test"})

/** @type {import('jest').Config} */
const config = {
    testEnvironment: "node",
    setupFilesAfterEnv: ["<rootDir>src/tests/jestSetup.js"],
    verbose: true,
    clearMocks: true,
    transform: {}, // run as native ESM (no transform),
    testTimeout: 60000,
    // forceExit: true
}

export default config;