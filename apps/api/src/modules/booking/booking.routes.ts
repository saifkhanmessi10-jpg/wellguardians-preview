import { env } from "../../config/env.js";
import { Router } from "express";
import rateLimit from "express-rate-limit";
import { APPOINTMENT_TYPES, TOPICS, availabilityQuerySchema, createBookingSchema } from "@wg/shared";
import { param, parse } from "../../lib/validate.js";
import { buildIcs } from "../../lib/ics.js";
import { cancelBooking, createBooking, findByToken, getAvailability } from "./booking.service.js";

export const bookingRouter = Router();

const writeLimiter = rateLimit({ windowMs: 15 * 60_000, limit: env.WRITE_RATE_LIMIT, standardHeaders: "draft-7", legacyHeaders: false });

bookingRouter.get("/appointment-types", (_req, res) => {
  res.set("Cache-Control", "public, max-age=300");
  res.json({ types: Object.values(APPOINTMENT_TYPES), topics: TOPICS });
});

bookingRouter.get("/availability", async (req, res) => {
  const q = parse(availabilityQuerySchema, req.query);
  res.set("Cache-Control", "no-store");
  res.json(await getAvailability(q));
});

bookingRouter.post("/bookings", writeLimiter, async (req, res) => {
  const input = parse(createBookingSchema, req.body);
  res.status(201).json(await createBooking(input));
});

/** Public, token-scoped view used by the "manage booking" link. Returns no contact details. */
bookingRouter.get("/bookings/manage/:token", async (req, res) => {
  const b = await findByToken(param(req.params.token));
  res.json({
    reference: b.reference,
    type: b.type,
    start: b.start.toISOString(),
    end: b.end.toISOString(),
    mode: b.mode,
    status: b.status,
    firstName: b.contact?.firstName ?? "",
  });
});

bookingRouter.post("/bookings/manage/:token/cancel", writeLimiter, async (req, res) => {
  const b = await cancelBooking(param(req.params.token));
  res.json({ reference: b.reference, status: b.status });
});

bookingRouter.get("/bookings/manage/:token/calendar.ics", async (req, res) => {
  const b = await findByToken(param(req.params.token));
  const t = APPOINTMENT_TYPES[b.type as keyof typeof APPOINTMENT_TYPES];
  res.type("text/calendar").attachment(`wellguardians-${b.reference}.ics`).send(
    buildIcs({
      uid: b.reference,
      start: b.start,
      end: b.end,
      title: `WellGuardians: ${t.label}`,
      description: `Reference ${b.reference}. ${b.mode === "video" ? "Your video link will be emailed before the call." : "We'll call the number you provided."}`,
    }),
  );
});
