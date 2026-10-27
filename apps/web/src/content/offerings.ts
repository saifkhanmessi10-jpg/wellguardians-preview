import { photos, type Photo } from "./site";

/**
 * Prices are placeholders until Sabine's confirmed price sheet is loaded.
 * `price: null` renders as "Price coming soon" rather than a made-up number.
 * TODO(sabine): fill every `price` from the approved package documents.
 */
export interface Plan {
  id: string;
  name: string;
  price: number | null;
  hours: string;
  forWho: string;
  features: string[];
  recommended?: boolean;
}

export const plans: Plan[] = [
  {
    id: "essential",
    name: "Essential Advocacy",
    price: null,
    hours: "Light monthly support",
    forWho: "One issue at a time: a bill, a denial, an upcoming procedure.",
    features: ["Monthly check-in call", "Bill and Explanation of Benefits review", "Secure messaging", "Visit preparation notes"],
  },
  {
    id: "family",
    name: "Family Navigator",
    price: null,
    hours: "Ongoing monthly support",
    forWho: "Families coordinating care for a parent or loved one.",
    features: ["Everything in Essential", "Care coordination across providers", "Family member access", "Appeals guidance coaching"],
    recommended: true,
  },
  {
    id: "complex",
    name: "Complex Care Partner",
    price: null,
    hours: "Priority monthly support",
    forWho: "Serious or chronic illness with many moving parts.",
    features: ["Everything in Family Navigator", "Weekly case updates", "Priority response", "Joining provider and insurer calls with your authorization"],
  },
];

export const otherPackages = [
  { name: "Hourly consultation", desc: "Pay as you go for a single question or review.", price: null },
  { name: "Wellness and coaching plan", desc: "Structured coaching for a condition or caregiving routine.", price: null },
  { name: "Organizational advisory retainer", desc: "Ongoing consulting for clinics, facilities and agencies.", price: null, href: "/organizations" },
];

/* ----------------------------- Academy ----------------------------- */
/** Source: Georgia CNA 85-hour curriculum framework provided by WellGuardians. */
export const cnaProgram = {
  totalHours: 85,
  classroomHours: 61,
  clinicalHours: 24,
  prerequisite: [
    { code: "M1", title: "Infection control & prevention", hours: 4, lab: "Timed hand hygiene; donning and doffing gowns, masks and gloves" },
    { code: "M2", title: "Communication & interpersonal skills", hours: 3, lab: "Role-play with cognitively or sensory-impaired residents" },
    { code: "M3", title: "Safety & emergency procedures", hours: 3, lab: "Abdominal thrusts, fire response (RACE/PASS), bed safety" },
    { code: "M4", title: "Promoting residents' independence", hours: 3, lab: "Adaptive equipment and choice-driven dressing" },
    { code: "M5", title: "Respecting residents' rights", hours: 3, lab: "Privacy curtains, bath blankets and confidentiality" },
  ],
  core: [
    { code: "A.1", title: "Vital signs & anatomy", hours: 8, lab: "Manual blood pressure, radial pulse, respirations" },
    { code: "A.2", title: "Physical measurement", hours: 7, lab: "Weight of an ambulatory resident, urinary output" },
    { code: "B.1", title: "Skin care & hygiene", hours: 9, lab: "Perineal care, partial bed bath, foot care, dentures" },
    { code: "B.2", title: "Daily living support", hours: 9, lab: "Dressing with a weak arm, feeding, mouth care" },
    { code: "C.1", title: "Mobility & body mechanics", hours: 6, lab: "Gait belt ambulation and transfers, range of motion" },
    { code: "C.2", title: "Cognitive & specialty care", hours: 6, lab: "Dementia care, end-of-life care, side-lying positioning" },
  ],
  clinical: [
    { label: "Shifts 1 and 2", hours: "Hours 1–16", detail: "Facility orientation and core skills with real residents: bathing, feeding, vital signs, turning." },
    { label: "Shift 3", hours: "Hours 17–24", detail: "Total patient care, multi-resident time management and mock state skills evaluations." },
  ],
  standards: [
    "100% attendance across all 85 hours. Missed hours are made up one-to-one with an instructor.",
    "75% or higher on every unit exam and the final exam.",
    "Every critical step of the 20 state-recognized skills passed before clinicals begin.",
    "Clinicals in a Medicare/Medicaid long-term care facility with one RN or LPN instructor per 10 students.",
    "No more than 8 training hours in a day. Cohorts of up to 20 students with two instructors.",
  ],
  testing: "After completion you'll be eligible to sit the Georgia NNAAP exam (written or oral, plus skills) through Credentia.",
  approvalNotice:
    "Our CNA program application with the Georgia Department of Community Health is in progress. Join the cohort list and we'll contact you the moment enrollment opens.",
};

export const specialtyTrainings = [
  { title: "Dementia & Alzheimer's care", desc: "Communication, routines, sundowning and safety at home.", status: "open" as const },
  { title: "Post-stroke care", desc: "Positioning, mobility, swallowing safety and daily routines.", status: "open" as const },
  { title: "Home ventilator awareness", desc: "What family caregivers and aides need to know day to day.", status: "open" as const },
  { title: "Tracheostomy care", desc: "Suctioning awareness, site care and emergency readiness.", status: "open" as const },
  { title: "PEG tube care", desc: "Feeding, flushing, site care and when to call.", status: "open" as const },
  { title: "Peritoneal dialysis respite care", desc: "Supporting families on home dialysis.", status: "later" as const },
  { title: "Wound care", desc: "Prevention and everyday care for caregivers.", status: "later" as const },
];

/* ------------------------------ Shop ------------------------------- */
export interface CareBox {
  slug: string;
  name: string;
  forWho: string;
  inside: string[];
  photo: Photo;
  photoPosition?: string;
  price: number | null;
}

export const careBoxes: CareBox[] = [
  {
    slug: "stress-overwhelm",
    name: "Stress & Overwhelm",
    forWho: "For anyone carrying too much right now, including caregivers.",
    // TODO(sabine): confirm contents of every box
    inside: ["Herbal tea sampler", "Soy candle", "Guided journal", "Cozy socks", "Encouragement cards"],
    photo: photos.boxStress,
    price: null,
  },
  {
    slug: "cancer-support",
    name: "Cancer Support",
    forWho: "Comfort for treatment days and the long weeks in between.",
    inside: ["Soft head covering", "Unscented lotion", "Ginger chews", "Journal", "Ribbon keepsake"],
    photo: photos.boxCancer,
    photoPosition: "50% 85%",
    price: null,
  },
  {
    slug: "chronic-illness-pain",
    name: "Chronic Illness & Pain",
    forWho: "Small comforts for people living with ongoing pain or illness.",
    inside: ["Heat pack", "Pill organizer", "Comfort socks", "Calming tea", "Symptom journal"],
    photo: photos.boxChronic,
    price: null,
  },
  {
    slug: "maternity-new-baby",
    name: "Maternity & New Baby",
    forWho: "For expecting and new mothers in the first weeks.",
    inside: ["Nipple balm", "Postpartum care items", "Tea for nursing mothers", "Baby keepsake card", "Journal"],
    photo: photos.boxMaternity,
    price: null,
  },
];
