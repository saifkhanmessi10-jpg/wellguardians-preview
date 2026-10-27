import { photos, type Photo } from "./site";

/** Keep Sabine's existing articles and FAQ wording. Phase 2 moves these to the CMS. */

export const faqs: { q: string; a: string; group: "general" | "billing" | "privacy" }[] = [
  { group: "general", q: "What is WellGuardian?", a: "WellGuardian Health & Advocacy Consulting provides independent, non-clinical health advocacy, care navigation, and consulting services to help clients understand, navigate, and manage complex healthcare systems. We also provide a range of health education services to help you better care for your loved ones or your patients." },
  { group: "general", q: "Do you provide medical care or nursing services?", a: "No. WellGuardian does not provide medical diagnosis, treatment, nursing services, home health services, or legal advice. We work alongside your licensed providers to support communication, coordination, and decision-making." },
  { group: "general", q: "What happens on the free consultation?", a: "It's a 45-minute call by video or phone. You tell us what's going on, we explain how we could help and which plan fits, and you decide with no obligation. Weekday, evening and Saturday times are available." },
  { group: "billing", q: "How does the monthly retainer work?", a: "Your monthly retainer secures ongoing advocacy and consulting support based on your selected service level. Retainers are billed monthly through Stripe and renew automatically unless canceled per the service agreement." },
  { group: "billing", q: "When do services begin?", a: "Services begin once your intake form is submitted and your selected monthly retainer payment is received. You will then receive instructions to schedule your Welcome Call." },
  { group: "general", q: "Will you communicate with my doctors or insurance company?", a: "With your authorization, WellGuardian may assist with communication and coordination with healthcare providers and insurance companies as part of advocacy support. We do not give medical instructions or override provider recommendations." },
  { group: "billing", q: "Can you help with insurance denials or medical bills?", a: "Yes. WellGuardian provides education, guidance, document review, and advocacy support related to insurance claims, denials, and billing concerns. We do not provide legal representation." },
  { group: "billing", q: "Do you accept insurance?", a: "No. WellGuardian does not bill insurance. You may choose to submit receipts to your insurer for potential reimbursement, depending on your plan." },
  { group: "privacy", q: "Is my information kept confidential?", a: "Yes. WellGuardian follows HIPAA-aligned privacy standards and maintains secure electronic records." },
  { group: "billing", q: "How do I cancel my retainer?", a: "Cancellation terms are outlined in your Service Agreement. Generally, retainers may be canceled with written notice prior to the next billing cycle." },
];

export interface Article {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  photo: Photo;
  body: { h?: string; p: string }[];
}

export const articles: Article[] = [
  {
    slug: "informed-decisions-supported-care",
    title: "Informed Decisions, Supported Care",
    date: "2025-12-20",
    excerpt: "Ten reasons everyone navigating the healthcare system needs a health advocate.",
    photo: photos.kitchenTable,
    body: [
      { p: "At WellGuardians, we believe that informed decisions lead to better care outcomes. Our blog is dedicated to providing you with the information you need to make confident choices about your health and the health of your loved ones." },
      { h: "10 reasons everyone navigating the healthcare system needs a health advocate", p: "Navigating today's healthcare system can feel overwhelming, especially when you're sick, stressed, or caring for a loved one. A health advocate acts as a trusted guide, helping patients and families move through care with clarity, confidence, and support." },
      { h: "1. They translate medical information into plain language", p: "Medical terminology can be confusing and intimidating. A health advocate helps you understand diagnoses, test results, and treatment options so you can make informed decisions." },
      { h: "2. They make sure your voice is heard", p: "Appointments are often short, and important concerns can be overlooked. Advocates ensure your questions, symptoms, and preferences are clearly communicated to your care team." },
      { h: "3. They coordinate complex care", p: "When multiple doctors, specialists, or facilities are involved, advocates help keep care organized and aligned, reducing confusion and delays." },
      { h: "4. They help prevent medical errors", p: "From medications to procedures, advocates double-check details and speak up when something doesn't seem right, helping protect patient safety." },
      { h: "5. They support informed decision-making", p: "Health advocates help you weigh options, understand risks and benefits, and seek second opinions when needed, without pressure or confusion." },
      { h: "6. They navigate insurance and billing challenges", p: "Medical bills and insurance policies can be frustrating. Advocates help review charges, explain coverage, and assist with appeals or disputes." },
      { h: "7. They provide emotional support during stressful moments", p: "Illness and healthcare decisions can be emotionally draining. An advocate offers reassurance, perspective, and steady support when it's needed most." },
      { h: "8. They save time and reduce stress", p: "Scheduling appointments, tracking test results, and managing paperwork takes energy. Advocates streamline these tasks so patients can focus on healing." },
      { h: "9. They empower patients and families", p: "By educating patients about their rights and options, advocates help individuals feel confident asking questions and participating in their care." },
      { h: "10. They improve the overall healthcare experience", p: "Clear communication, coordinated care, and patient-centered support often lead to better outcomes and a more humane healthcare journey." },
    ],
  },
  {
    slug: "empowering-caregivers-and-families",
    title: "Empowering Caregivers and Families",
    date: "2026-01-10",
    excerpt: "Practical tips and support for families managing a loved one's care.",
    photo: photos.family,
    body: [
      { p: "Caregivers and families face unique challenges when managing the healthcare of their loved ones. Our blog provides practical tips, resources, and support to help you navigate these challenges with confidence." },
      { p: "Learn about effective communication strategies, understanding medical terminology, and advocating for the best possible care." },
    ],
  },
  {
    slug: "why-you-might-need-a-health-advocate",
    title: "Why You Might Need a Health Advocate",
    date: "2026-01-10",
    excerpt: "What happens when a doctor won't listen, the jargon doesn't make sense, or it all feels like too much.",
    photo: photos.conversation,
    body: [
      { p: "Discover the crucial role a health advocate can play in ensuring your voice is heard and your healthcare needs are met." },
      { p: "We'll look at specific situations where having an advocate by your side makes a real difference: when a doctor won't listen, when you don't understand the jargon, and when you feel overwhelmed." },
    ],
  },
];
export const getArticle = (slug: string) => articles.find((a) => a.slug === slug);
