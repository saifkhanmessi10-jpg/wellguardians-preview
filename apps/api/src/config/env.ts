import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(4000),
  MONGODB_URI: z.string().url().default("mongodb://127.0.0.1:27017/wellguardians"),
  /** Comma-separated list of allowed browser origins. */
  CORS_ORIGINS: z.string().default("http://localhost:3000"),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]).default("info"),
  /** Trust N proxy hops (Render/Fly/Nginx) so rate limiting sees the real client IP. */
  TRUST_PROXY: z.coerce.number().default(1),
  /** Max booking/lead submissions per IP per 15 minutes. */
  WRITE_RATE_LIMIT: z.coerce.number().default(10),
});

export const env = envSchema.parse(process.env);
export const isProd = env.NODE_ENV === "production";
