import { z } from "zod";

export const LEAD_KINDS = ["contact", "proposal", "waitlist", "newsletter"] as const;

const base = {
  email: z.string().trim().toLowerCase().email("Enter a valid email address").max(254),
  website: z.string().max(0).optional().default(""), // honeypot
  source: z.string().max(120).optional(),
};

export const contactLeadSchema = z.object({
  kind: z.literal("contact"),
  name: z.string().trim().min(1, "Enter your name").max(120),
  topic: z.enum(["advocacy", "billing", "academy", "care_packages", "organizations", "other"]),
  message: z.string().trim().min(10, "Tell us a little more (10+ characters)").max(2000),
  ...base,
});

export const proposalLeadSchema = z.object({
  kind: z.literal("proposal"),
  name: z.string().trim().min(1, "Enter your name").max(120),
  organization: z.string().trim().min(1, "Enter your organization").max(160),
  orgType: z.enum(["clinic", "senior_living", "home_care", "hospital", "faith_community", "other"]),
  size: z.enum(["1-10", "11-50", "51-200", "200+"]),
  needs: z.array(z.enum(["staff_training", "quality_improvement", "program_development", "patient_advocacy_program", "community_workshops", "other"])).min(1, "Choose at least one need"),
  timeline: z.enum(["0-3m", "3-6m", "exploring"]),
  phone: z.string().trim().max(30).optional(),
  details: z.string().trim().max(2000).optional().default(""),
  ...base,
});

export const waitlistLeadSchema = z.object({
  kind: z.literal("waitlist"),
  name: z.string().trim().max(120).optional(),
  list: z.enum(["cna_cohort", "specialty_training", "care_packages", "supplements"]),
  ...base,
});

export const newsletterLeadSchema = z.object({
  kind: z.literal("newsletter"),
  ...base,
});

export const createLeadSchema = z.discriminatedUnion("kind", [
  contactLeadSchema,
  proposalLeadSchema,
  waitlistLeadSchema,
  newsletterLeadSchema,
]);
export type CreateLeadInput = z.infer<typeof createLeadSchema>;
