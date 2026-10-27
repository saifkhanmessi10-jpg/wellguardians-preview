import type { Metadata } from "next";
import { PageHero } from "@/components/blocks";
import { Photo } from "@/components/Photo";
import { ProposalForm } from "@/components/ProposalForm";
import { photos } from "@/content/site";

export const metadata: Metadata = {
  title: "For organizations",
  description: "Healthcare consulting, quality improvement and staff training for clinics, senior living, home-care agencies and community groups.",
};

const offers = [
  ["Staff training", "Dementia, post-stroke, home ventilator, tracheostomy and PEG tube care, delivered online and in person."],
  ["Quality improvement", "Find what's slipping, fix the process and measure the result."],
  ["Program development", "Structure for new care, outreach or chronic disease programs, built on evidence-based practice."],
  ["Community health workshops", "Practical sessions for churches and community groups on caregiving and navigating care."],
];

export default function OrganizationsPage() {
  return (
    <>
      <PageHero title="For clinics, facilities and community programs" lead="Advocacy, training and quality support from a team with over 15 years in clinical care, population health and healthcare leadership." photo={photos.organizations}>
        <a href="#proposal" className="btn-primary">Request a proposal</a>
        <a href="/book?topic=organization" className="btn-quiet">Book a discovery call</a>
      </PageHero>

      <section className="wrap mt-20 grid gap-x-12 gap-y-10 md:grid-cols-2">
        {offers.map(([t, b]) => (
          <div key={t} className="border-t-2 border-forest-800 pt-5">
            <h2 className="text-3xl">{t}</h2>
            <p className="mt-2 text-ink-soft">{b}</p>
          </div>
        ))}
      </section>

      <section className="mt-20 bg-linen py-16">
        <div className="wrap">
          <h2 className="text-4xl">How an engagement runs</h2>
          <ol className="mt-8 grid gap-6 md:grid-cols-4">
            {["Discovery call", "Written proposal", "Delivery", "Report and next steps"].map((t, i) => (
              <li key={t} className="rounded-xl bg-white p-5">
                <span className="font-display text-3xl text-marigold-700">{i + 1}</span>
                <h3 className="mt-1 font-sans text-lg font-semibold">{t}</h3>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="proposal" className="wrap mt-20 grid gap-12 lg:grid-cols-[1fr_1.3fr]">
        <div>
          <h2 className="text-4xl">Request a proposal</h2>
          <p className="mt-4 text-lg text-ink-soft">Two short steps. Sabine replies within one business day.</p>
          <Photo photo={photos.instructor} className="mt-8 hidden aspect-[4/3] rounded-2xl lg:block" />
        </div>
        <div className="rounded-2xl border border-line bg-white p-6 sm:p-8"><ProposalForm /></div>
      </section>
    </>
  );
}
