import { DateTime, Interval } from "luxon";
import { BUSINESS_TIMEZONE, type Slot } from "@wg/shared";
import { SCHEDULE, type WorkingBlock } from "../../config/schedule.js";

export interface BusyRange {
  start: Date;
  end: Date;
}

export interface SlotOptions {
  durationMin: number;
  now?: DateTime;
  blocks?: readonly WorkingBlock[];
}

function windowFor(dt: DateTime): Slot["window"] {
  if (dt.weekday >= 6) return "weekend";
  return dt.hour >= 17 ? "evening" : "weekday_day";
}

/**
 * Pure function: given a date range and busy ranges, return bookable slots.
 * A slot is valid if [start, end + buffer) does not overlap any busy range,
 * the appointment itself fits inside a working block, and it respects notice/horizon.
 */
export function generateSlots(fromISODate: string, days: number, busy: BusyRange[], opts: SlotOptions) {
  const now = opts.now ?? DateTime.now().setZone(BUSINESS_TIMEZONE);
  const blocks = opts.blocks ?? SCHEDULE.blocks;
  const earliest = now.plus({ hours: SCHEDULE.minNoticeHours });
  const latest = now.plus({ days: SCHEDULE.maxHorizonDays });
  const busyIntervals = busy.map((b) => Interval.fromDateTimes(DateTime.fromJSDate(b.start), DateTime.fromJSDate(b.end)));

  const out: { date: string; slots: Slot[] }[] = [];
  let day = DateTime.fromISO(fromISODate, { zone: BUSINESS_TIMEZONE }).startOf("day");

  for (let i = 0; i < days; i++, day = day.plus({ days: 1 })) {
    const slots: Slot[] = [];
    for (const block of blocks.filter((b) => b.weekday === day.weekday)) {
      const [sh, sm] = block.start.split(":").map(Number) as [number, number];
      const [eh, em] = block.end.split(":").map(Number) as [number, number];
      const blockEnd = day.set({ hour: eh, minute: em });
      for (let t = day.set({ hour: sh, minute: sm }); ; t = t.plus({ minutes: SCHEDULE.stepMin })) {
        const end = t.plus({ minutes: opts.durationMin });
        if (end > blockEnd) break;
        if (t < earliest || t > latest) continue;
        const occupied = Interval.fromDateTimes(t, end.plus({ minutes: SCHEDULE.bufferMin }));
        if (busyIntervals.some((b) => b.overlaps(occupied))) continue;
        slots.push({ start: t.toISO()!, end: end.toISO()!, window: windowFor(t) });
      }
    }
    out.push({ date: day.toISODate()!, slots });
  }
  return out;
}

/** Lock-granularity block starts covering [start, blockedUntil). */
export function lockBlocks(start: Date, blockedUntil: Date): Date[] {
  const g = SCHEDULE.lockGranularityMin * 60_000;
  const first = Math.floor(start.getTime() / g) * g;
  const res: Date[] = [];
  for (let t = first; t < blockedUntil.getTime(); t += g) res.push(new Date(t));
  return res;
}

/** True if `start` lands on a slot the generator would have offered. */
export function isOfferedSlot(startISO: string, durationMin: number, busy: BusyRange[], now?: DateTime) {
  const start = DateTime.fromISO(startISO, { setZone: true }).setZone(BUSINESS_TIMEZONE);
  if (!start.isValid) return false;
  const days = generateSlots(start.toISODate()!, 1, busy, { durationMin, now });
  return days[0]?.slots.some((s) => DateTime.fromISO(s.start).toMillis() === start.toMillis()) ?? false;
}
