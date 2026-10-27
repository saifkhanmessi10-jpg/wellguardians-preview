import { defineConfig } from "vitest/config";
export default defineConfig({ test: { env: { NODE_ENV: "test", WRITE_RATE_LIMIT: "1000" }, environment: "node", testTimeout: 60_000, hookTimeout: 120_000 } });
