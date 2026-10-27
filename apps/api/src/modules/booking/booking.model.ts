import { Schema, model, type InferSchemaType } from "mongoose";
import { appointmentTypeIds, topicIds } from "@wg/shared";

const bookingSchema = new Schema(
  {
    reference: { type: String, required: true, unique: true },
    type: { type: String, enum: appointmentTypeIds, required: true },
    topic: { type: String, enum: topicIds, required: true },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    /** end + buffer — the span the owner is blocked for. */
    blockedUntil: { type: Date, required: true },
    mode: { type: String, enum: ["video", "phone"], required: true },
    status: { type: String, enum: ["confirmed", "cancelled", "completed", "no_show"], default: "confirmed", index: true },
    contact: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true, index: true },
      phone: { type: String, required: true },
      preferredContact: { type: String, enum: ["email", "phone", "text"], default: "email" },
    },
    notes: { type: String, default: "" },
    smsOptIn: { type: Boolean, default: false },
    disclaimerAcceptedAt: { type: Date, required: true },
    clientTimezone: String,
    /** Hash of the token sent in the confirmation email for reschedule/cancel. */
    manageTokenHash: { type: String, required: true, index: true },
    source: { type: String, default: "web" },
  },
  { timestamps: true },
);

bookingSchema.index({ start: 1, status: 1 });

export type BookingDoc = InferSchemaType<typeof bookingSchema>;
export const Booking = model("Booking", bookingSchema);

/**
 * One document per lock-granularity block the owner is busy for.
 * The unique index on `at` is what guarantees no double booking, even
 * with many API instances and no multi-document transactions.
 */
const slotLockSchema = new Schema({
  at: { type: Date, required: true, unique: true },
  bookingId: { type: Schema.Types.ObjectId, required: true, index: true },
});
export const SlotLock = model("SlotLock", slotLockSchema);

/** Manual time-off / holidays. Phase 2: synced from Google Calendar. */
const availabilityBlockSchema = new Schema(
  {
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    reason: String,
  },
  { timestamps: true },
);
availabilityBlockSchema.index({ start: 1, end: 1 });
export const AvailabilityBlock = model("AvailabilityBlock", availabilityBlockSchema);
