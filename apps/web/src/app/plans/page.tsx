import type { Metadata } from "next";
import Link from "next/link";
import clsx from "clsx";
import { Check } from "lucide-react";
import { CtaBand, PageHero } from "@/components/blocks";
import { otherPackages, plans } from "@/content/offerings";
import { price } from "@/lib/format";

export const metadata: Metadata = {
  title: "Plans and pricing",
  description: "Monthly advocacy retainers for individuals and families, plus hourly and organizational options.",
};

export default function PlansPage() {
  return (
    <>
      <PageHero title="Plans and pricing" lead="Predictable monthly support instead of surprise hourly bills. Every plan starts with a free consultation so we can recommend the right level." />

      <section className="wrap mt-16" aria-label="Monthly retainer plans">
        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map((p) => (
            <article key={p.id} className={clsx("relative flex flex-col rounded-2xl border bg-white p-7", p.recommended ? "border-forest-800 ring-2 ring-forest-800" : "border-line")}>
              {p.recommended && <p className="absolute -top-3.5 left-7 rounded-full bg-marigold px-3 py-0.5 text-[0.8rem] font-semibold text-forest-950">Most families choose this</p>}
              <h2 className="text-3xl">{p.name}</h2>
              <p className="mt-2 text-ink-soft">{p.forWho}</p>
              <p className="mt-6">
                <span className="font-display text-4xl text-forest-900">{price(p.price)}</span>
                {p.price !== null && <span className="text-ink-soft"> / month</span>}
              </p>
              <p className="text-[0.9rem] text-ink-soft">{p.hours}</p>
              <ul className="mt-6 flex-1 space-y-2.5">
                {p.features.map((f) => <li key={f} className="flex gap-2.5"><Check className="mt-1 size-4 shrink-0 text-ok" aria-hidden />{f}</li>)}
              </ul>
              <Link href="/book?topic=aging_parent" className={clsx("mt-8", p.recommended ? "btn-primary" : "btn-quiet")}>
                Book a free call about {p.name}
              </Link>
            </article>
          ))}
        </div>
        <p className="mt-6 text-[0.9rem] text-ink-soft">
          Retainers are billed monthly through Stripe and renew automatically. Cancel with written notice before your next billing date. We don't bill insurance, but you may submit receipts to your insurer.
        </p>
      </section>

      <section className="wrap mt-20" aria-labelledby="other-h">
        <h2 id="other-h" className="text-4xl">Other ways to work with us</h2>
        <ul className="mt-8 divide-y divide-line border-y border-line">
          {otherPackages.map((o) => (
            <li key={o.name} className="flex flex-wrap items-center justify-between gap-4 py-5">
              <div>
                <h3 className="font-sans text-lg font-semibold">{o.name}</h3>
                <p className="text-ink-soft">{o.desc}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-ink-soft">{price(o.price)}</span>
                <Link href={o.href ?? "/book"} className="btn-quiet min-h-10 px-4 text-sm">{o.href ? "Learn more" : "Ask about this"}</Link>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <CtaBand />
    </>
  );
}
