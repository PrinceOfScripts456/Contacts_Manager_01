import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        // Runs once before all test files: starts an in-memory MongoDB
        // and points MONGO_URI at it. See tests/setup.js.
        globalSetup: "./tests/setup.js",
        // API tests share one Mongo connection across files; running
        // test files in parallel processes would each try to connect
        // separately and race on env vars, so keep it simple and serial.
        fileParallelism: false,
        testTimeout: 20000,
    },
});
