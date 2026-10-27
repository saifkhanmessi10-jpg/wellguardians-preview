import { Types } from "mongoose";
import { DateTime } from "luxon";
import {
  APPOINTMENT_TYPES,
  BUSINESS_TIMEZONE,
  type AvailabilityQuery,
  type BookingConfirmation,
  type CreateBookingInput,
} from "@wg/shared";
import { SCHEDULE } from "../../config/schedule.js";
import { AppError, conflict, notFound } from "../../lib/errors.js";
import { hashToken, newReference, newToken } from "../../lib/tokens.js";
import { notify } from "../../lib/notify.js";
import { AvailabilityBlock, Booking, SlotLock } from "./booking.model.js";
import { generateSlots, isOfferedSlot, lockBlocks, type BusyRange } from "./slots.js";

const DUP_KEY = 11000;

async function busyBetween(from: Date, to: Date): Promise<BusyRange[]> {
  const [bookings, blocks] = await Promise.all([
    Booking.find({ status: "confirmed", start: { $lt: to }, blockedUntil: { $gt: from } }, { start: 1, blockedUntil: 1 }).lean(),
    AvailabilityBlock.find({ start: { $lt: to }, end: { $gt: from } }, { start: 1, end: 1 }).lean(),
  ]);
  return [
    ...bookings.map((b) => ({ start: b.start, end: b.blockedUntil })),
    ...blocks.map((b) => ({ start: b.start, end: b.end })),
  ];
}

export async function getAvailability(q: AvailabilityQuery) {
  const type = APPOINTMENT_TYPES[q.type];
  const from = DateTime.fromISO(q.from, { zone: BUSINESS_TIMEZONE }).startOf("day");
  const to = from.plus({ days: q.days });
  const busy = await busyBetween(from.toJSDate(), to.toJSDate());
  return { timezone: BUSINESS_TIMEZONE, days: generateSlots(q.from, q.days, busy, { durationMin: type.durationMin }) };
}

export async function createBooking(input: CreateBookingInput): Promise<BookingConfirmation> {
  // Honeypot: pretend success to bots without writing anything.
  if (input.website) throw new AppError(400, "rejected", "Unable to process this request.");

  const type = APPOINTMENT_TYPES[input.type];
  const start = DateTime.fromISO(input.start, { setZone: true });
  const end = start.plus({ minutes: type.durationMin });
  const blockedUntil = end.plus({ minutes: SCHEDULE.bufferMin });

  const dayStart = start.setZone(BUSINESS_TIMEZONE).startOf("day");
  const busy = await busyBetween(dayStart.toJSDate(), dayStart.plus({ days: 1 }).toJSDate());
  if (!isOfferedSlot(input.start, type.durationMin, busy)) {
    throw conflict("slot_unavailable", "That time is no longer available. Please choose another time.");
  }

  const bookingId = new Types.ObjectId();
  const locks = lockBlocks(start.toJSDate(), blockedUntil.toJSDate()).map((at) => ({ at, bookingId }));

  // Step 1: claim every 15-minute block atomically per block. Any collision → abort.
  try {
    await SlotLock.insertMany(locks, { ordered: true });
  } catch (err: unknown) {
    await SlotLock.deleteMany({ bookingId });
    if ((err as { code?: number }).code === DUP_KEY) {
      throw conflict("slot_unavailable", "That time was just booked by someone else. Please choose another time.");
    }
    throw err;
  }

  // Step 2: persist the booking. If this fails, release the locks.
  const manageToken = newToken();
  try {
    const booking = await Booking.create({
      _id: bookingId,
      reference: newReference(),
      type: input.type,
      topic: input.topic,
      start: start.toJSDate(),
      end: end.toJSDate(),
      blockedUntil: blockedUntil.toJSDate(),
      mode: input.mode,
      contact: input.contact,
      notes: input.notes,
      smsOptIn: input.smsOptIn,
      disclaimerAcceptedAt: new Date(),
      clientTimezone: input.clientTimezone,
      manageTokenHash: hashToken(manageToken),
    });
    notify({ kind: "booking.confirmed", bookingId: booking.id, reference: booking.reference, manageToken });
    return {
      id: booking.id,
      reference: booking.reference,
      type: input.type,
      start: booking.start.toISOString(),
      end: booking.end.toISOString(),
      mode: input.mode,
      manageToken,
    };
  } catch (err) {
    await SlotLock.deleteMany({ bookingId });
    throw err;
  }
}

export async function findByToken(token: string) {
  const booking = await Booking.findOne({ manageTokenHash: hashToken(token) });
  if (!booking) throw notFound("We couldn't find that booking. The link may have expired.");
  return booking;
}

export async function cancelBooking(token: string) {
  const booking = await findByToken(token);
  if (booking.status !== "confirmed") return booking;
  if (booking.start.getTime() < Date.now()) {
    throw conflict("already_started", "This appointment has already started and can't be cancelled online.");
  }
  booking.status = "cancelled";
  await booking.save();
  await SlotLock.deleteMany({ bookingId: booking._id });
  notify({ kind: "booking.cancelled", bookingId: booking.id, reference: booking.reference });
  return booking;
}
