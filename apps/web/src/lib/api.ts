import type { ApiError } from "@wg/shared";

/** Same-origin API path; next.config rewrites /api/v1 → API service. */
const BASE = "/api/v1";

export class ApiRequestError extends Error {
  constructor(public status: number, public code: string, message: string, public fields?: Record<string, string>) {
    super(message);
  }
}

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(BASE + path, {
      ...init,
      headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    });
  } catch {
    throw new ApiRequestError(0, "network", "We couldn't reach our server. Check your connection and try again.");
  }
  if (res.ok) return (await res.json()) as T;
  const body = (await res.json().catch(() => null)) as ApiError | null;
  if (res.status === 429) throw new ApiRequestError(429, "rate_limited", "Too many attempts. Please wait a few minutes and try again.");
  throw new ApiRequestError(
    res.status,
    body?.error.code ?? "unknown",
    body?.error.message ?? "Something went wrong. Please try again.",
    body?.error.fields,
  );
}
