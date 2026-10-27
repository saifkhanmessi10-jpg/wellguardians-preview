import type { Metadata } from "next";
import { Info } from "lucide-react";
import { PageHero } from "@/components/blocks";
import { WaitlistForm } from "@/components/forms";
import { cnaProgram as p } from "@/content/offerings";
import { photos } from "@/content/site";

export const metadata: Metadata = {
  title: "Georgia CNA program",
  description: "An 85-hour Georgia Certified Nurse Aide program: 61 classroom and lab hours and 24 supervised clinical hours, preparing you for the NNAAP exam.",
};

function HoursBar() {
  const pre = p.prerequisite.reduce((a, m) => a + m.hours, 0);
  const core = p.core.reduce((a, m) => a + m.hours, 0);
  const seg = [
    { label: "Prerequisite core", h: pre, cls: "bg-forest-600" },
    { label: "Classroom and lab", h: core, cls: "bg-forest-800" },
    { label: "Supervised clinicals", h: p.clinicalHours, cls: "bg-marigold" },
  ];
  return (
    <figure>
      <div className="flex h-5 overflow-hidden rounded-full" role="img" aria-label={`${pre} prerequisite hours, ${core} classroom and lab hours, ${p.clinicalHours} clinical hours, ${p.totalHours} total`}>
        {seg.map((s) => <div key={s.label} className={s.cls} style={{ width: `${(s.h / p.totalHours) * 100}%` }} />)}
      </div>
      <figcaption className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-[0.95rem]">
        {seg.map((s) => (
          <span key={s.label} className="flex items-center gap-2"><span aria-hidden className={`size-3 rounded-sm ${s.cls}`} />{s.label}: <strong>{s.h} hours</strong></span>
        ))}
      </figcaption>
    </figure>
  );
}

function ModuleTable({ caption, rows }: { caption: string; rows: typeof p.core }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-line bg-white">
      <table className="w-full min-w-[36rem] text-left">
        <caption className="px-5 pt-5 text-left font-display text-2xl text-forest-900">{caption}</caption>
        <thead>
          <tr className="border-b border-line text-[0.85rem] text-ink-soft">
            <th scope="col" className="px-5 py-3 font-semibold">Unit</th>
            <th scope="col" className="px-5 py-3 font-semibold">Topic</th>
            <th scope="col" className="px-5 py-3 text-right font-semibold">Hours</th>
            <th scope="col" className="px-5 py-3 font-semibold">Skills practised in lab</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((m) => (
            <tr key={m.code} className="border-b border-line last:border-0">
              <td className="px-5 py-3.5 font-semibold text-forest-800">{m.code}</td>
              <th scope="row" className="px-5 py-3.5 font-semibold">{m.title}</th>
              <td className="px-5 py-3.5 text-right tabular-nums">{m.hours}</td>
              <td className="px-5 py-3.5 text-ink-soft">{m.lab}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function CnaPage() {
  return (
    <>
      <PageHero title="Georgia CNA program" lead="Eighty-five hours of classroom, skills lab and supervised clinical training, built to the Georgia Department of Community Health standard." photo={photos.cohort}>
        <a href="#cohort-list" className="btn-primary">Join the cohort list</a>
        <a href="/book?topic=training" className="btn-quiet">Ask us a question</a>
      </PageHero>

      <section className="wrap mt-12">
        <div role="note" className="flex gap-4 rounded-xl border border-marigold bg-[#fff7df] p-5 sm:p-6">
          <Info className="mt-0.5 size-6 shrink-0 text-marigold-700" aria-hidden />
          <p className="text-lg">{p.approvalNotice}</p>
        </div>
      </section>

      <section className="wrap mt-16">
        <h2 className="text-4xl">How the 85 hours break down</h2>
        <div className="mt-8"><HoursBar /></div>
      </section>

      <section className="wrap mt-16 space-y-8">
        <ModuleTable caption="Prerequisite core (16 hours, before any resident contact)" rows={p.prerequisite} />
        <ModuleTable caption="Classroom and skills lab (45 hours)" rows={p.core} />
      </section>

      <section className="wrap mt-16 grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className="text-4xl">Supervised clinicals (24 hours)</h2>
          <p className="mt-3 text-ink-soft">In a Medicare/Medicaid licensed long-term care facility, with one state-approved RN or LPN instructor for every 10 students.</p>
          <ol className="mt-6 space-y-4">
            {p.clinical.map((c) => (
              <li key={c.label} className="rounded-xl border border-line bg-white p-5">
                <p className="font-semibold">{c.label} <span className="font-normal text-ink-soft">({c.hours})</span></p>
                <p className="mt-1 text-ink-soft">{c.detail}</p>
              </li>
            ))}
          </ol>
        </div>
        <div>
          <h2 className="text-4xl">What it takes to pass</h2>
          <ul className="mt-6 space-y-3">
            {p.standards.map((s) => <li key={s} className="border-l-2 border-marigold pl-4">{s}</li>)}
          </ul>
          <p className="mt-6 rounded-lg bg-forest-50 p-4">{p.testing}</p>
        </div>
      </section>

      <section id="cohort-list" className="wrap mt-20">
        <div className="rounded-2xl bg-white p-6 ring-1 ring-line sm:p-10">
          <h2 className="text-4xl">Join the cohort list</h2>
          <p className="mt-3 max-w-2xl text-lg text-ink-soft">Cohorts are capped at 20 students with two instructors. We'll email dates, tuition and enrollment details as soon as the program is approved. Joining the list is free and doesn't commit you to anything.</p>
          <div className="mt-8 max-w-2xl"><WaitlistForm list="cna_cohort" cta="Join the cohort list" source="cna_page" /></div>
        </div>
      </section>
    </>
  );
}
