import type { Metadata } from "next";
import { PageHero } from "@/components/blocks";
import { WaitlistForm } from "@/components/forms";
import { Photo } from "@/components/Photo";
import { careBoxes } from "@/content/offerings";
import { price } from "@/lib/format";

export const metadata: Metadata = { title: "Care packages", description: "Comfort care packages packed by hand in Georgia and shipped anywhere in the U.S." };

export default function ShopPage() {
  return (
    <>
      <PageHero title="Care packages" lead="Thoughtful comfort boxes, packed by hand in Georgia and shipped anywhere in the U.S. for one flat rate. Every box comes with or without scripture cards." />
      <section className="wrap mt-16">
        <p role="note" className="mb-10 rounded-lg bg-forest-50 px-5 py-4">Online ordering opens soon. Join the list below and we'll email you the day the shop goes live.</p>
        <div className="grid gap-12 md:grid-cols-2">
          {careBoxes.map((b) => (
            <article key={b.slug} id={b.slug} className="scroll-mt-28">
              <Photo photo={b.photo} position={b.photoPosition} className="aspect-[4/3] rounded-2xl" />
              <div className="mt-5 flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-3xl">{b.name}</h2>
                <span className="text-ink-soft">{price(b.price)}</span>
              </div>
              <p className="mt-2 text-ink-soft">{b.forWho}</p>
              <h3 className="mt-4 font-sans text-base font-semibold">What's inside</h3>
              <p className="mt-1 text-ink-soft">{b.inside.join(", ")}.</p>
            </article>
          ))}
        </div>
        <p className="mt-10 text-[0.9rem] text-ink-soft">Comfort items only, not medical products. Supplements are coming later.</p>
      </section>
      <section className="wrap mt-16">
        <div className="rounded-2xl bg-linen p-6 sm:p-10">
          <h2 className="text-4xl">Tell me when the shop opens</h2>
          <div className="mt-6 max-w-2xl"><WaitlistForm list="care_packages" cta="Notify me" source="shop_page" /></div>
        </div>
      </section>
    </>
  );
}
