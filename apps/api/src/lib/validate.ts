import type { z, ZodTypeAny } from "zod";
import { badRequest } from "./errors.js";

export function parse<S extends ZodTypeAny>(schema: S, data: unknown): z.output<S> {
  const result = schema.safeParse(data);
  if (result.success) return result.data;
  const fields: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const key = issue.path.join(".") || "_";
    fields[key] ??= issue.message;
  }
  throw badRequest("Please check the highlighted fields.", fields);
}

export const param = (v: unknown) => (typeof v === "string" ? v : "");
