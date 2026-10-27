/**
 * Site-wide facts. Anything marked TODO(sabine) needs a confirmed value
 * before launch — grep the repo for "TODO(sabine)".
 */
export const site = {
  name: "WellGuardians",
  legalName: "WellGuardians Health and Advocacy Consultants, LLC",
  tagline: "Your Health, Our Guidance",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://wellguardians.com",
  email: "info@wellguardians.com",
  phone: null as string | null, // TODO(sabine): current site shows a template placeholder number
  region: "Georgia, United States",
  hours: "Weekdays 9am–8:30pm, Saturdays 10am–3pm (Eastern)",
  replyPromise: "We reply within one business day.",
};

export const disclaimer =
  "WellGuardian Health and Advocacy Consulting provides non-clinical education, care navigation, and advocacy support. We do not provide medical diagnosis, treatment, nursing services, home health services, or legal advice.";

export const nav = [
  {
    label: "Advocacy",
    href: "/advocacy",
    children: [
      { label: "Patient Advocacy & Care Navigation", href: "/advocacy/patient-advocacy-care-navigation" },
      { label: "Insurance & Billing Advocacy", href: "/advocacy/insurance-billing-advocacy" },
      { label: "Care Coordination", href: "/advocacy/care-coordination" },
      { label: "Health Education & Wellness Coaching", href: "/advocacy/health-education-wellness-coaching" },
      { label: "Plans & pricing", href: "/plans" },
    ],
  },
  { label: "Organizations", href: "/organizations" },
  {
    label: "Academy",
    href: "/academy",
    children: [
      { label: "Georgia CNA program", href: "/academy/cna" },
      { label: "Specialty trainings", href: "/academy/specialty" },
      { label: "CPR & BLS", href: "/academy/cpr" },
    ],
  },
  { label: "Care packages", href: "/shop" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
];

/**
 * Real photography from Pexels (free commercial license, attribution not required
 * but kept for our records). Never pair a face with a diagnosis or a testimonial.
 * Before launch: self-host optimized copies instead of hot-linking.
 */
const px = (id: number) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1600`;

export const photos = {
  hero: { src: px(7358347), alt: "Three generations of women sitting together at home, smiling", credit: "Pexels #7358347" },
  kitchenTable: { src: px(6975185), alt: "An older couple reading paperwork together at the kitchen table", credit: "T Leish / Pexels" },
  conversation: { src: px(29373893), alt: "An adult daughter listening as her mother talks on the sofa", credit: "Jsme MILA / Pexels" },
  billing: { src: px(6963927), alt: "A couple going through bills with a calculator and laptop", credit: "Mikhail Nilov / Pexels" },
  organizations: { src: px(7735626), alt: "A consultant walking two clients through a printed document", credit: "Pexels #7735626" },
  family: { src: px(4262410), alt: "A family wrapped together in a group hug", credit: "August de Richelieu / Pexels" },
  skillsLab: { src: px(35645525), alt: "Nursing students practising a blood pressure check in a skills lab", credit: "Sahil Singh / Pexels" },
  cohort: { src: px(35645504), alt: "Students in scrubs listening to an instructor beside a training manikin", credit: "Sahil Singh / Pexels" },
  instructor: { src: px(35645532), alt: "An instructor in gloves demonstrating care on a training manikin", credit: "Sahil Singh / Pexels" },
  cpr: { src: px(34104785), alt: "Hands performing chest compressions on a CPR training manikin", credit: "Aleson Padilha / Pexels" },
  boxStress: { src: px(20221234), alt: "A wrapped gift box beside a cup of tea", credit: "Gülnihalce / Pexels" },
  boxCancer: { src: px(8467379), alt: "Four candles nested in a kraft gift box", credit: "Ahloki / Pexels" },
  boxChronic: { src: px(5632343), alt: "A gift box with a black ribbon next to skincare bottles", credit: "Karola G / Pexels" },
  boxMaternity: { src: px(6393346), alt: "A newborn's hand holding a parent's finger", credit: "William Fortunato / Pexels" },
} as const;

export type Photo = (typeof photos)[keyof typeof photos];
