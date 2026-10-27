import { BUSINESS_TIMEZONE } from "@wg/shared";

export const price = (n: number | null, suffix = "") =>
  n === null ? "Price coming soon" : `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}${suffix}`;

export const fmtDay = (iso: string, tz: string = BUSINESS_TIMEZONE) =>
  new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric", timeZone: tz }).format(new Date(iso));

export const fmtTime = (iso: string, tz: string = BUSINESS_TIMEZONE) =>
  new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone: tz }).format(new Date(iso));

export const fmtDate = (ymd: string) =>
  new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(ymd));
