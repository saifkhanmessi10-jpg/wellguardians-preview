import { z } from "zod";

/**
 * Booking domain contract shared by the web app and the API.
 * Keep this file free of runtime dependencies other than zod so it can be
 * bundled into the browser.
 */

export const BUSINESS_TIMEZONE = "America/New_York" as const;

export const APPOINTMENT_TYPES = {
  consultation: {
    id: "consultation",
    label: "Free 45-minute consultation",
    description: "Tell us what's going on. We'll listen, explain your options and recommend next steps. No cost, no obligation.",
    durationMin: 45,
    priceCents: 0,
  },
  org_discovery: {
    id: "org_discovery",
    label: "Organization discovery call",
    description: "For clinics, senior living, home-care agencies and community groups exploring consulting or staff training.",
    durationMin: 30,
    priceCents: 0,
  },
  academy_info: {
    id: "academy_info",
    label: "Academy info session",
    description: "Questions about the CNA program, specialty trainings or CPR? Talk them through with us.",
    durationMin: 20,
    priceCents: 0,
  },
} as const;

export type AppointmentTypeId = keyof typeof APPOINTMENT_TYPES;
export const appointmentTypeIds = Object.keys(APPOINTMENT_TYPES) as [AppointmentTypeId, ...AppointmentTypeId[]];

export const TOPICS = [
  { id: "aging_parent", label: "Caring for an aging parent" },
  { id: "own_health", label: "My own health or a chronic condition" },
  { id: "bills_insurance", label: "A medical bill or insurance denial" },
  { id: "care_coordination", label: "Coordinating care between providers" },
  { id: "training", label: "Training for me or my staff" },
  { id: "organization", label: "Consulting for my organization" },
  { id: "other", label: "Something else" },
] as const;
export const topicIds = TOPICS.map((t) => t.id) as unknown as [string, ...string[]];

/** Time windows clients can filter by (Sabine offers weekdays, evenings and weekends). */
export const TIME_WINDOWS = ["weekday_day", "evening", "weekend"] as const;

export const availabilityQuerySchema = z.object({
  type: z.enum(appointmentTypeIds),
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD"),
  days: z.coerce.number().int().min(1).max(31).default(14),
});
export type AvailabilityQuery = z.infer<typeof availabilityQuerySchema>;

export const slotSchema = z.object({
  start: z.string().datetime({ offset: true }),
  end: z.string().datetime({ offset: true }),
  window: z.enum(TIME_WINDOWS),
});
export type Slot = z.infer<typeof slotSchema>;

export const availabilityResponseSchema = z.object({
  timezone: z.string(),
  days: z.array(z.object({ date: z.string(), slots: z.array(slotSchema) })),
});
export type AvailabilityResponse = z.infer<typeof availabilityResponseSchema>;

const phoneRegex = /^[+()\-.\s\d]{10,20}$/;

export const createBookingSchema = z.object({
  type: z.enum(appointmentTypeIds),
  topic: z.enum(topicIds),
  start: z.string().datetime({ offset: true }),
  mode: z.enum(["video", "phone"]),
  contact: z.object({
    firstName: z.string().trim().min(1, "Enter your first name").max(60),
    lastName: z.string().trim().min(1, "Enter your last name").max(60),
    email: z.string().trim().toLowerCase().email("Enter a valid email address").max(254),
    phone: z.string().trim().regex(phoneRegex, "Enter a phone number with at least 10 digits"),
    preferredContact: z.enum(["email", "phone", "text"]).default("email"),
  }),
  /** Free text. UI tells people not to include diagnoses or record numbers. */
  notes: z.string().trim().max(1000).optional().default(""),
  smsOptIn: z.boolean().default(false),
  acceptedDisclaimer: z.literal(true, {
    errorMap: () => ({ message: "Please confirm you understand our services are non-clinical" }),
  }),
  clientTimezone: z.string().max(64).optional(),
  /** Honeypot — must be empty. */
  website: z.string().max(0).optional().default(""),
});
export type CreateBookingInput = z.infer<typeof createBookingSchema>;

export const bookingConfirmationSchema = z.object({
  id: z.string(),
  reference: z.string(),
  type: z.enum(appointmentTypeIds),
  start: z.string(),
  end: z.string(),
  mode: z.enum(["video", "phone"]),
  manageToken: z.string(),
});
export type BookingConfirmation = z.infer<typeof bookingConfirmationSchema>;
