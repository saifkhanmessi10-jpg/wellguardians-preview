import Link from "next/link";
import type { ReactNode } from "react";
import { Check, X } from "lucide-react";
import { doesList, doesNotList } from "@/content/services";
import type { Photo as P } from "@/content/site";
import { Photo } from "./Photo";

export function PageHero({ title, lead, photo, children, position }: { title: string; lead: string; photo?: P; children?: ReactNode; position?: string }) {
  return (
    <section className="border-b border-line bg-linen">
      <div className={photo ? "wrap grid items-center gap-10 py-14 lg:grid-cols-[1.1fr_1fr] lg:py-20" : "wrap py-14 lg:py-20"}>
        <div>
          <h1 className="text-[2.6rem] sm:text-6xl">{title}</h1>
          <p className="measure mt-5 text-xl text-ink-soft">{lead}</p>
          {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
        </div>
        {photo && <Photo photo={photo} priority position={position} className="aspect-[4/3] rounded-tl-[3rem] rounded-br-[3rem]" />}
      </div>
    </section>
  );
}

export function CtaBand({ title = "Not sure where to start? That's what the free call is for.", body = "Forty-five minutes, no cost, no obligation. Weekday, evening and Saturday times." }: { title?: string; body?: string }) {
  return (
    <section className="wrap mt-24">
      <div className="relative overflow-hidden rounded-2xl bg-forest-800 px-6 py-12 text-white sm:px-12">
        <div aria-hidden className="absolute -right-10 -top-16 size-64 rounded-full border-[28px] border-marigold/90" />
        <div className="relative max-w-2xl">
          <h2 className="text-4xl text-white sm:text-5xl">{title}</h2>
          <p className="mt-4 text-lg text-forest-200">{body}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/book" className="btn-gold">Book my free consultation</Link>
            <Link href="/contact" className="btn-on-dark">Send a question instead</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ScopeTable() {
  return (
    <div className="grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2">
      <div className="bg-white p-6 sm:p-8">
        <h3 className="text-2xl">What we do</h3>
        <ul className="mt-4 space-y-3">
          {doesList.map((d) => <li key={d} className="flex gap-3"><Check className="mt-1 size-5 shrink-0 text-ok" aria-hidden />{d}</li>)}
        </ul>
      </div>
      <div className="bg-paper p-6 sm:p-8">
        <h3 className="text-2xl">What we don't do</h3>
        <ul className="mt-4 space-y-3 text-ink-soft">
          {doesNotList.map((d) => <li key={d} className="flex gap-3"><X className="mt-1 size-5 shrink-0 text-alert" aria-hidden />{d}</li>)}
        </ul>
        <p className="mt-6 text-[0.9rem] text-ink-soft">We work alongside your licensed providers. We never override their recommendations.</p>
      </div>
    </div>
  );
}

export function SectionHead({ title, lead, id }: { title: string; lead?: string; id?: string }) {
  return (
    <div className="mb-10 max-w-2xl">
      <h2 id={id} className="text-4xl sm:text-5xl">{title}</h2>
      {lead && <p className="mt-4 text-lg text-ink-soft">{lead}</p>}
    </div>
  );
}
