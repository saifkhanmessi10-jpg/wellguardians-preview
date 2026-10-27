import { photos, type Photo } from "./site";

export interface Service {
  slug: string;
  title: string;
  audience: "individuals" | "organizations" | "training";
  outcome: string;
  summary: string;
  painPoints: string[];
  howWeHelp: string[];
  photo: Photo;
  bookingTopic: string;
}

/** Copy reworked from Sabine's existing pages. TODO(sabine): approve wording. */
export const services: Service[] = [
  {
    slug: "patient-advocacy-care-navigation",
    title: "Patient Advocacy & Care Navigation",
    audience: "individuals",
    outcome: "Walk into every appointment prepared, and walk out understanding what happens next.",
    summary: "We help you understand options, prepare for visits, and make sure your voice is heard by your care team.",
    painPoints: [
      "Appointments feel rushed and your questions don't get answered.",
      "Medical jargon leaves you unsure what was actually decided.",
      "You're making a big decision and want someone in your corner.",
    ],
    howWeHelp: [
      "Visit preparation: your questions, symptoms and priorities written down before you go",
      "Plain-language explanations of diagnoses, test results and treatment options",
      "Support getting second opinions and referrals moving",
      "Follow-up notes so the whole family knows the plan",
      "With your authorization, communication with your providers",
    ],
    photo: photos.conversation,
    bookingTopic: "own_health",
  },
  {
    slug: "insurance-billing-advocacy",
    title: "Insurance & Billing Advocacy",
    audience: "individuals",
    outcome: "Understand every charge, and challenge the ones that are wrong.",
    summary: "We review medical bills, explain insurance benefits, and guide you through appeals for denied claims.",
    painPoints: [
      "A bill arrived that doesn't match what your insurer said you'd owe.",
      "A claim or prior authorization was denied.",
      "You're not sure which charges are errors and which are real.",
    ],
    howWeHelp: [
      "Line-by-line review of bills against your Explanation of Benefits",
      "Explaining coverage, deductibles and out-of-pocket limits",
      "Appeals guidance coaching and letter review",
      "Preparing you for calls with billing offices and insurers",
      "Organizing your paperwork so nothing is lost",
    ],
    photo: photos.billing,
    bookingTopic: "bills_insurance",
  },
  {
    slug: "care-coordination",
    title: "Care Coordination",
    audience: "individuals",
    outcome: "One clear picture of who's doing what across every provider.",
    summary: "We help organize appointments, records and communication among your providers so care stays aligned.",
    painPoints: [
      "Several specialists, and none of them seem to talk to each other.",
      "You're managing a parent's care from a distance.",
      "Records, prescriptions and referrals keep falling through the cracks.",
    ],
    howWeHelp: [
      "A shared care calendar and contact list for every provider",
      "Records requests and documentation review",
      "Tracking referrals, test results and follow-ups",
      "Family updates so siblings and caregivers stay in sync",
    ],
    photo: photos.kitchenTable,
    bookingTopic: "care_coordination",
  },
  {
    slug: "health-education-wellness-coaching",
    title: "Health Education & Wellness Coaching",
    audience: "individuals",
    outcome: "Know enough about a condition to care for yourself or someone you love with confidence.",
    summary: "Plain-language education and coaching for patients and family caregivers.",
    painPoints: [
      "A new diagnosis in the family and you don't know where to start.",
      "You're the main caregiver and want to do it well.",
    ],
    howWeHelp: [
      "One-to-one education sessions on a condition or care routine",
      "Caregiver coaching: routines, safety and avoiding burnout",
      "Trusted resources chosen for your situation",
    ],
    photo: photos.family,
    bookingTopic: "aging_parent",
  },
  {
    slug: "healthcare-consulting",
    title: "Healthcare Consulting",
    audience: "organizations",
    outcome: "Practical guidance for complex healthcare decisions and systems.",
    summary: "Independent consulting for practices, programs and community organizations.",
    painPoints: ["You need an experienced outside view on a care program or process."],
    howWeHelp: ["Program reviews", "Patient experience improvements", "Policy and workflow guidance"],
    photo: photos.organizations,
    bookingTopic: "organization",
  },
  {
    slug: "organizational-healthcare-consulting",
    title: "Organizational Healthcare Consulting",
    audience: "organizations",
    outcome: "Better quality, safer care and stronger programs.",
    summary: "Quality improvement, program development and evidence-based practice for clinics, facilities and agencies.",
    painPoints: ["Quality measures are slipping.", "You're launching a new program and need structure."],
    howWeHelp: ["Quality improvement projects", "Program development", "Evidence-based practice and staff education"],
    photo: photos.organizations,
    bookingTopic: "organization",
  },
  {
    slug: "health-aide-care-support-training",
    title: "Health Aide and Care Support Training (Non-Certification)",
    audience: "training",
    outcome: "Practical caregiving skills for families and working aides.",
    summary: "Hands-on caregiver training that doesn't lead to state certification. For the Georgia CNA program, see the Academy.",
    painPoints: ["You care for someone at home and want to do it safely."],
    howWeHelp: ["Safe transfers and positioning", "Personal care and hygiene", "Recognizing when to call the doctor"],
    photo: photos.instructor,
    bookingTopic: "training",
  },
];

export const advocacyServices = services.filter((s) => s.audience === "individuals");
export const getService = (slug: string) => services.find((s) => s.slug === slug);

export const doesList = [
  "Care navigation support",
  "Insurance claim explanation",
  "Appeals guidance coaching",
  "Health education and coaching",
  "Documentation review and organization",
  "Doctor visit preparation",
];
export const doesNotList = [
  "Medical treatment or diagnosis",
  "Prescribing medications",
  "Home health nursing services",
  "Clinical procedures",
  "Legal representation",
];
