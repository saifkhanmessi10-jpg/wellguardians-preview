import Link from "next/link";
import { CtaBand, ScopeTable, SectionHead } from "@/components/blocks";
import { Photo } from "@/components/Photo";
import { articles, faqs } from "@/content/articles";
import { careBoxes } from "@/content/offerings";
import { advocacyServices } from "@/content/services";
import { photos } from "@/content/site";
import { fmtDate } from "@/lib/format";

const caseNote = [
  { done: true, text: "Itemized bill requested from the hospital" },
  { done: true, text: "Two duplicate charges found and flagged" },
  { done: true, text: "Appeal letter reviewed with Mrs. Carter" },
  { done: false, text: "Insurer decision expected in 30 days" },
];

const whoWeHelp = [
  { title: "Caring for an aging parent", body: "Appointments, medications and paperwork across several doctors, often from a distance.", href: "/book?topic=aging_parent" },
  { title: "Living with a serious or chronic illness", body: "Someone to explain your options and make sure your questions get answered.", href: "/book?topic=own_health" },
  { title: "Fighting a bill or a denial", body: "Line-by-line review of what you've been charged, and help with appeals.", href: "/advocacy/insurance-billing-advocacy" },
  { title: "Running a clinic, agency or church program", body: "Consulting, quality improvement and hands-on staff training.", href: "/organizations" },
];

export default function Home() {
  return (
    <>
      {/* Hero: the one bold moment. A real family photo with an advocate's case note on top. */}
      <section className="relative overflow-hidden bg-forest-800 text-white">
        <div className="wrap grid gap-12 pb-20 pt-14 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:pb-28 lg:pt-20">
          <div>
            <h1 className="text-[2.9rem] leading-[1.05] text-white sm:text-7xl">Your health, our guidance.</h1>
            <p className="measure mt-6 text-xl text-forest-200">
              An independent health advocate for Georgia families, so you're never sorting out doctors, bills and insurance on your own.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/book" className="btn-gold">Book my free 45-minute consultation</Link>
              <Link href="/plans" className="btn-on-dark">See plans and pricing</Link>
            </div>
            <p className="mt-8 text-[0.95rem] text-forest-200">
              Over 15 years in clinical care and healthcare leadership. Evening and Saturday appointments.
            </p>
          </div>

          <div className="relative">
            <Photo photo={photos.hero} priority className="aspect-[5/4] rounded-tl-[4rem] rounded-br-[4rem] ring-1 ring-white/10" sizes="(min-width:1024px) 50vw, 100vw" />
            <figure className="relative mx-4 -mt-20 rounded-xl bg-paper p-5 text-ink shadow-[0_24px_48px_-20px_rgba(0,0,0,.55)] sm:absolute sm:-bottom-10 sm:right-[-1rem] sm:mx-0 sm:mt-0 sm:w-[22rem] lg:-left-14 lg:right-auto">
              <figcaption className="flex items-center justify-between border-b border-line pb-3">
                <span className="font-display text-xl text-forest-900">Case notes</span>
                <span className="rounded-full bg-marigold px-2.5 py-0.5 text-[0.75rem] font-semibold text-forest-950">Billing appeal</span>
              </figcaption>
              <ol className="mt-3 space-y-2.5 text-[0.92rem]">
                {caseNote.map((c) => (
                  <li key={c.text} className="flex items-start gap-2.5">
                    <span aria-hidden className={c.done ? "mt-1.5 size-2.5 shrink-0 rounded-full bg-forest-800" : "mt-1.5 size-2.5 shrink-0 rounded-full border-2 border-forest-800"} />
                    <span className={c.done ? "" : "text-ink-soft"}>
                      <span className="sr-only">{c.done ? "Done: " : "Next: "}</span>{c.text}
                    </span>
                  </li>
                ))}
              </ol>
              <p className="mt-3 text-[0.75rem] text-ink-soft">Illustrative example.</p>
            </figure>
          </div>
        </div>
      </section>

      <section className="wrap mt-28" aria-labelledby="who-h">
        <SectionHead id="who-h" title="Who we help" lead="Most people call us when something has gone wrong, or when they can see it's about to." />
        <ul className="grid gap-x-10 gap-y-2 md:grid-cols-2">
          {whoWeHelp.map((w) => (
            <li key={w.title}>
              <Link href={w.href} className="group block border-t-2 border-forest-800 py-6">
                <h3 className="text-3xl group-hover:text-forest-600">{w.title}</h3>
                <p className="mt-2 text-ink-soft">{w.body}</p>
                <span className="mt-3 inline-block font-semibold text-forest-800 underline decoration-marigold decoration-2 underline-offset-4">
                  {w.href.startsWith("/book") ? "Book a free call about this" : "Learn how we help"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-28 bg-linen py-20" aria-labelledby="how-h">
        <div className="wrap grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <Photo photo={photos.kitchenTable} position="50% 95%" className="aspect-[4/5] rounded-tr-[4rem] rounded-bl-[4rem]" />
          <div>
            <h2 id="how-h" className="text-4xl sm:text-5xl">How it works</h2>
            <ol className="mt-8 space-y-8">
              {[
                ["Free consultation", "Forty-five minutes by video or phone to understand what's going on and what you need."],
                ["Choose your plan", "A monthly retainer sized to how much help you need. Billed through Stripe, cancel with written notice."],
                ["Your Welcome Call", "Once your intake form and first payment are in, we build your care plan and get to work."],
              ].map(([t, b], i) => (
                <li key={t} className="grid grid-cols-[3rem_1fr] gap-4">
                  <span aria-hidden className="font-display text-5xl leading-none text-marigold-700">{i + 1}</span>
                  <div>
                    <h3 className="text-2xl">{t}</h3>
                    <p className="mt-1 text-ink-soft">{b}</p>
                  </div>
                </li>
              ))}
            </ol>
            <Link href="/book" className="btn-primary mt-10">Start with a free consultation</Link>
          </div>
        </div>
      </section>

      <section className="wrap mt-24" aria-labelledby="svc-h">
        <SectionHead id="svc-h" title="Advocacy services" lead="Independent and non-clinical. We sit on your side of the table." />
        <div className="grid gap-6 md:grid-cols-2">
          {advocacyServices.map((s) => (
            <Link key={s.slug} href={`/advocacy/${s.slug}`} className="group grid grid-cols-[7rem_1fr] gap-5 rounded-xl border border-line bg-white p-4 hover:border-forest-600 sm:grid-cols-[9rem_1fr]">
              <Photo photo={s.photo} className="aspect-square rounded-lg" sizes="10rem" />
              <div className="py-1">
                <h3 className="text-2xl group-hover:text-forest-600">{s.title}</h3>
                <p className="mt-2 text-[0.95rem] text-ink-soft">{s.summary}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="wrap mt-24" aria-labelledby="scope-h">
        <SectionHead id="scope-h" title="Clear about what we do" />
        <ScopeTable />
      </section>

      <section className="mt-24 bg-forest-50 py-20" aria-labelledby="academy-h">
        <div className="wrap grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 id="academy-h" className="text-4xl sm:text-5xl">WellGuardians Academy</h2>
            <p className="measure mt-4 text-lg text-ink-soft">
              Become a Certified Nurse Aide through our 85-hour Georgia program, or learn to care for someone you love with specialty trainings in dementia, post-stroke, trach, PEG and ventilator care.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/academy/cna" className="btn-primary">See the CNA program</Link>
              <Link href="/academy/specialty" className="btn-quiet">Specialty trainings</Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Photo photo={photos.skillsLab} className="aspect-[3/4] rounded-xl" sizes="25vw" />
            <Photo photo={photos.cohort} className="mt-10 aspect-[3/4] rounded-xl" sizes="25vw" />
          </div>
        </div>
      </section>

      <section className="wrap mt-24" aria-labelledby="shop-h">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHead id="shop-h" title="Care packages" lead="Comfort boxes packed by hand in Georgia and shipped anywhere in the U.S. Each comes with or without scripture cards." />
          <Link href="/shop" className="btn-quiet mb-10">See all care packages</Link>
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {careBoxes.map((b) => (
            <Link key={b.slug} href={`/shop#${b.slug}`} className="group">
              <Photo photo={b.photo} position={b.photoPosition} className="aspect-square rounded-xl" sizes="(min-width:1024px) 25vw, 50vw" />
              <h3 className="mt-3 font-sans text-base font-semibold group-hover:text-forest-600">{b.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      <section className="wrap mt-24 grid gap-12 lg:grid-cols-[1fr_1.4fr]" aria-labelledby="faq-h">
        <div>
          <h2 id="faq-h" className="text-4xl sm:text-5xl">Common questions</h2>
          <Link href="/faq" className="mt-6 inline-block font-semibold text-forest-800 underline decoration-marigold decoration-2 underline-offset-4">Read all FAQs</Link>
        </div>
        <div className="divide-y divide-line border-y border-line">
          {faqs.slice(1, 7).map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-lg font-semibold">
                {f.q}
                <span aria-hidden className="mt-1 text-2xl leading-none text-forest-800 transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="measure mt-3 text-ink-soft">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="wrap mt-24" aria-labelledby="blog-h">
        <SectionHead id="blog-h" title="From the blog" />
        <div className="grid gap-8 md:grid-cols-3">
          {articles.map((a) => (
            <article key={a.slug}>
              <Link href={`/blog/${a.slug}`} className="group block">
                <Photo photo={a.photo} className="aspect-[3/2] rounded-xl" sizes="(min-width:768px) 33vw, 100vw" />
                <p className="mt-4 text-[0.85rem] text-ink-soft"><time dateTime={a.date}>{fmtDate(a.date)}</time></p>
                <h3 className="mt-1 text-2xl group-hover:text-forest-600">{a.title}</h3>
                <p className="mt-2 text-ink-soft">{a.excerpt}</p>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <CtaBand />
    </>
  );
}
