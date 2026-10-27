import mongoose from "mongoose";
import { env } from "./config/env.js";
import { logger } from "./lib/logger.js";
import { createApp } from "./app.js";

async function main() {
  mongoose.set("strictQuery", true);
  await mongoose.connect(env.MONGODB_URI, { maxPoolSize: 20, serverSelectionTimeoutMS: 10_000 });
  // Build indexes at boot in dev; in production run `syncIndexes` from a release step instead.
  if (env.NODE_ENV !== "production") await Promise.all(Object.values(mongoose.models).map((m) => m.syncIndexes()));

  const server = createApp().listen(env.PORT, () => logger.info({ port: env.PORT }, "api listening"));

  const shutdown = async (signal: string) => {
    logger.info({ signal }, "shutting down");
    server.close(async () => {
      await mongoose.disconnect();
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10_000).unref();
  };
  process.on("SIGTERM", () => void shutdown("SIGTERM"));
  process.on("SIGINT", () => void shutdown("SIGINT"));
}

main().catch((err) => {
  logger.fatal({ err }, "failed to start");
  process.exit(1);
});
