import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaBand, PageHero, ScopeTable } from "@/components/blocks";
import { getService, services } from "@/content/services";

export const dynamicParams = false;
export const generateStaticParams = () => services.map((s) => ({ slug: s.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const s = getService((await params).slug);
  return s ? { title: s.title, description: s.summary } : {};
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const s = getService((await params).slug);
  if (!s) notFound();
  const isOrg = s.audience === "organizations";
  return (
    <>
      <PageHero title={s.title} lead={s.outcome} photo={s.photo}>
        <Link href={isOrg ? "/organizations#proposal" : `/book?topic=${s.bookingTopic}`} className="btn-primary">
          {isOrg ? "Request a proposal" : "Book a free consultation"}
        </Link>
        {!isOrg && <Link href="/plans" className="btn-quiet">See plans</Link>}
      </PageHero>

      <section className="wrap mt-20 grid gap-14 lg:grid-cols-2">
        <div>
          <h2 className="text-4xl">Sound familiar?</h2>
          <ul className="mt-6 space-y-4">
            {s.painPoints.map((p) => <li key={p} className="rounded-lg bg-linen px-5 py-4 text-lg">{p}</li>)}
          </ul>
        </div>
        <div>
          <h2 className="text-4xl">How we help</h2>
          <p className="mt-3 text-ink-soft">{s.summary}</p>
          <ul className="mt-6 divide-y divide-line border-y border-line">
            {s.howWeHelp.map((h) => <li key={h} className="py-3.5">{h}</li>)}
          </ul>
        </div>
      </section>

      {s.slug === "insurance-billing-advocacy" && (
        <section className="wrap mt-16">
          <p className="rounded-xl border border-forest-200 bg-forest-50 p-6 text-lg">
            Have a bill you want us to look at? Bring it to your free consultation. Once you're a client, you'll upload documents through your secure portal, never by email.
          </p>
        </section>
      )}

      {!isOrg && <section className="wrap mt-20"><ScopeTable /></section>}
      <CtaBand />
    </>
  );
}
