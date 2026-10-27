import { describe, expect, it } from "vitest";
import { DateTime } from "luxon";
import { generateSlots, isOfferedSlot, lockBlocks } from "./slots.js";

const TZ = "America/New_York";
// Monday 2026-11-02, 08:00 ET "now" a week earlier so notice rules don't interfere.
const now = DateTime.fromISO("2026-10-26T08:00", { zone: TZ });

describe("generateSlots", () => {
  it("offers 45-min consults inside working blocks on a Monday", () => {
    const [day] = generateSlots("2026-11-02", 1, [], { durationMin: 45, now });
    expect(day!.slots[0]!.start).toBe("2026-11-02T09:00:00.000-05:00");
    // last daytime slot must end by 17:00 → 16:00 start
    const daytime = day!.slots.filter((s) => s.window === "weekday_day");
    expect(daytime.at(-1)!.start).toContain("T16:00");
    expect(day!.slots.some((s) => s.window === "evening")).toBe(true);
  });

  it("returns no slots on Sunday", () => {
    const [day] = generateSlots("2026-11-01", 1, [], { durationMin: 45, now });
    expect(day!.slots).toHaveLength(0);
  });

  it("labels Saturday slots as weekend", () => {
    const [day] = generateSlots("2026-11-07", 1, [], { durationMin: 45, now });
    expect(day!.slots.length).toBeGreaterThan(0);
    expect(day!.slots.every((s) => s.window === "weekend")).toBe(true);
  });

  it("blocks overlapping slots including the 15-minute buffer", () => {
    const busy = [{ start: new Date("2026-11-02T15:00:00Z"), end: new Date("2026-11-02T16:00:00Z") }]; // 10:00–11:00 ET
    const [day] = generateSlots("2026-11-02", 1, busy, { durationMin: 45, now });
    const starts = day!.slots.map((s) => DateTime.fromISO(s.start).setZone(TZ).toFormat("HH:mm"));
    expect(starts).not.toContain("09:30"); // 09:30–10:15 + buffer overlaps
    expect(starts).not.toContain("10:00");
    expect(starts).toContain("09:00"); // 09:00–09:45 + 15 = 10:00 → touches, no overlap
    expect(starts).toContain("11:00");
  });

  it("respects minimum notice", () => {
    const late = DateTime.fromISO("2026-11-02T08:00", { zone: TZ });
    const [day] = generateSlots("2026-11-02", 1, [], { durationMin: 20, now: late });
    expect(day!.slots[0]!.start).toContain("T20:00"); // only slots ≥ 12h later remain
  });

  it("validates offered slots and rejects off-grid times", () => {
    expect(isOfferedSlot("2026-11-02T09:00:00-05:00", 45, [], now)).toBe(true);
    expect(isOfferedSlot("2026-11-02T09:10:00-05:00", 45, [], now)).toBe(false);
    expect(isOfferedSlot("2026-11-01T10:00:00-05:00", 45, [], now)).toBe(false);
  });
});

describe("lockBlocks", () => {
  it("covers appointment plus buffer in 15-minute blocks", () => {
    const blocks = lockBlocks(new Date("2026-11-02T14:00:00Z"), new Date("2026-11-02T15:00:00Z"));
    expect(blocks).toHaveLength(4);
  });
});
