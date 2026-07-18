// This file runs once before the test files. It starts a temporary,
// in-memory MongoDB instance (via mongodb-memory-server) so tests hit a
// real database without touching your actual dev/prod MongoDB, and
// without needing MONGO_URI or a running Mongo install at all.
//
// vitest.config.js points at this file via `globalSetup`.

import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

let mongod;

export async function setup() {
    // online DB
    if (process.env.TEST_MONGO_URI) {
        process.env.MONGO_URI = process.env.TEST_MONGO_URI;
        return;
    }

    // Pinned to a specific, known-available version rather than "latest"
    // — mongodb-memory-server downloads this binary on first run (and
    // caches it locally after that), and unpinned "latest" occasionally
    // points at a version/platform combo that isn't published yet.
    // local DB - requires download ~ 500MB
    mongod = await MongoMemoryServer.create({ binary: { version: "7.0.14" } });
    process.env.MONGO_URI = mongod.getUri();
}

export async function teardown() {
    await mongoose.disconnect();
    if (mongod) await mongod.stop();
}
