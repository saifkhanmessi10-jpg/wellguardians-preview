import type { Metadata } from "next";
import { CtaBand, PageHero } from "@/components/blocks";
import { faqs } from "@/content/articles";

export const metadata: Metadata = { title: "Frequently asked questions", description: "How WellGuardians works, what's included, billing, insurance and privacy." };

const groups = [["general", "About our services"], ["billing", "Plans, billing and insurance"], ["privacy", "Privacy"]] as const;

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return (
    <>
      <PageHero title="Frequently asked questions" lead="If you don't find what you're looking for, send us a message. We reply within one business day." />
      <section className="wrap mt-14 max-w-4xl space-y-14">
        {groups.map(([g, label]) => (
          <div key={g}>
            <h2 className="text-3xl">{label}</h2>
            <div className="mt-4 divide-y divide-line border-y border-line">
              {faqs.filter((f) => f.group === g).map((f) => (
                <details key={f.q} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-lg font-semibold">
                    {f.q}<span aria-hidden className="mt-1 text-2xl leading-none text-forest-800 transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="measure mt-3 text-ink-soft">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        ))}
      </section>
      <CtaBand />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
