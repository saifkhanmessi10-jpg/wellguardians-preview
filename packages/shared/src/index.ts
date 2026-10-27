export * from "./booking.js";
export * from "./leads.js";

/** Standard API error envelope. */
export interface ApiError {
  error: { code: string; message: string; fields?: Record<string, string> };
}
