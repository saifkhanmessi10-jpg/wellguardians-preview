import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand, PageHero, ScopeTable } from "@/components/blocks";
import { Photo } from "@/components/Photo";
import { advocacyServices } from "@/content/services";
import { photos } from "@/content/site";

export const metadata: Metadata = {
  title: "Health advocacy services",
  description: "Patient advocacy, insurance and billing help, care coordination and health coaching from an independent, non-clinical advocate in Georgia.",
};

export default function AdvocacyPage() {
  return (
    <>
      <PageHero title="Advocacy for you and your family" lead="We help you understand the system, prepare for every conversation, and make sure your voice is heard by doctors, billing offices and insurers." photo={photos.conversation}>
        <Link href="/book" className="btn-primary">Book a free consultation</Link>
        <Link href="/plans" className="btn-quiet">See plans</Link>
      </PageHero>

      <section className="wrap mt-20 space-y-16">
        {advocacyServices.map((s, i) => (
          <article key={s.slug} className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <Photo photo={s.photo} className={`aspect-[3/2] rounded-2xl ${i % 2 ? "lg:order-2" : ""}`} />
            <div>
              <h2 className="text-4xl">{s.title}</h2>
              <p className="mt-3 text-lg text-ink-soft">{s.outcome}</p>
              <ul className="mt-5 space-y-2">
                {s.howWeHelp.slice(0, 4).map((h) => <li key={h} className="border-l-2 border-marigold pl-3">{h}</li>)}
              </ul>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href={`/advocacy/${s.slug}`} className="btn-quiet">See the details<span className="sr-only"> for {s.title}</span></Link>
                <Link href={`/book?topic=${s.bookingTopic}`} className="btn-primary">Book a free call</Link>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="wrap mt-24"><ScopeTable /></section>
      <CtaBand />
    </>
  );
}
