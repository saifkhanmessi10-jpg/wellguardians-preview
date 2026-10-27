import type { Metadata } from "next";
import { CtaBand, PageHero } from "@/components/blocks";
import { Photo } from "@/components/Photo";
import { photos } from "@/content/site";

export const metadata: Metadata = { title: "About us", description: "A Georgia healthcare and public health consulting organization with over 15 years of experience in clinical care and healthcare leadership." };

const principles = [
  ["Integrity", "We advocate with honesty and transparency."],
  ["Compassion", "We prioritize your comfort and dignity."],
  ["Empowerment", "We equip clients with knowledge and confidence."],
  ["Collaboration", "We work alongside families and providers to improve care."],
];

export default function AboutPage() {
  return (
    <>
      <PageHero title="You're not alone in your healthcare journey" lead="WellGuardians Health and Advocacy Consultants, LLC is based in Georgia and dedicated to being your advocate and partner in navigating the healthcare system." photo={photos.family} />
      <section className="wrap mt-20 grid gap-12 lg:grid-cols-[1.2fr_1fr]">
        <div className="prose-wg text-lg">
          <h2>Who we are</h2>
          <p>We are a healthcare and public health consulting organization with over 15 years of experience in clinical care, population health, and healthcare leadership. Our team includes bedside nurses, social workers, and public health specialists.</p>
          <p>We support individuals, families, healthcare organizations and communities through advocacy, preventive care strategies, chronic disease management, public health initiatives and system-level improvements, with expertise in quality improvement, program development and evidence-based practice.</p>
          <p>With a data-driven and multicultural approach, we help clients navigate complex healthcare systems and put practical, effective solutions in place.</p>
          <h2>Our mission</h2>
          <p className="font-display text-2xl leading-snug text-forest-900">To protect and empower individuals and families with compassionate advocacy, expert guidance, and personalized support that leads to better healthcare experiences and outcomes.</p>
        </div>
        {/* TODO(sabine): replace with a real photo of Sabine and a short founder bio */}
        <Photo photo={photos.kitchenTable} className="aspect-[4/5] rounded-tr-[4rem] rounded-bl-[4rem]" />
      </section>
      <section className="wrap mt-20">
        <h2 className="text-4xl">Our guiding principles</h2>
        <dl className="mt-8 grid gap-x-10 gap-y-8 sm:grid-cols-2">
          {principles.map(([t, d]) => (
            <div key={t} className="border-t-2 border-marigold pt-4">
              <dt className="font-display text-3xl text-forest-900">{t}</dt>
              <dd className="mt-1 text-lg text-ink-soft">{d}</dd>
            </div>
          ))}
        </dl>
      </section>
      <CtaBand />
    </>
  );
}
