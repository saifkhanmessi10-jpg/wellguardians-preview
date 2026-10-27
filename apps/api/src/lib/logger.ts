import pino from "pino";
import { env } from "../config/env.js";

export const logger = pino({
  level: env.LOG_LEVEL,
  // Never log contact details or free-text notes.
  redact: {
    paths: ["req.headers.authorization", "req.headers.cookie", "*.email", "*.phone", "*.notes", "*.contact"],
    censor: "[redacted]",
  },
});
