/**
 * Owner availability rules. Phase 2 moves these into an admin-editable
 * collection and merges busy times from Google Calendar.
 * Times are wall-clock in BUSINESS_TIMEZONE (America/New_York).
 * Weekday: 1 = Monday … 7 = Sunday (ISO / Luxon).
 */
export interface WorkingBlock {
  weekday: number;
  start: string; // "HH:mm"
  end: string; // "HH:mm" — last slot must END by this time
}

export const SCHEDULE = {
  blocks: [
    ...[1, 2, 3, 4, 5].flatMap((d) => [
      { weekday: d, start: "09:00", end: "17:00" },
      { weekday: d, start: "17:30", end: "20:30" },
    ]),
    { weekday: 6, start: "10:00", end: "15:00" },
  ] satisfies WorkingBlock[],
  /** Gap kept free after every appointment for notes. */
  bufferMin: 15,
  /** Candidate start times fall on this grid. */
  stepMin: 30,
  /** Lock granularity used to prevent double booking. Must divide stepMin, bufferMin and all durations. */
  lockGranularityMin: 15,
  minNoticeHours: 12,
  maxHorizonDays: 60,
} as const;
