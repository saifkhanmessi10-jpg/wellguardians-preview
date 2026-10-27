import type { Metadata } from "next";
import { PageHero } from "@/components/blocks";
import { WaitlistForm } from "@/components/forms";
import { specialtyTrainings } from "@/content/offerings";
import { photos } from "@/content/site";

export const metadata: Metadata = { title: "Specialty trainings", description: "Dementia, post-stroke, ventilator, trach and PEG tube care training for caregivers and aides." };

export default function SpecialtyPage() {
  const open = specialtyTrainings.filter((t) => t.status === "open");
  const later = specialtyTrainings.filter((t) => t.status === "later");
  return (
    <>
      <PageHero title="Specialty trainings" lead="Practical, non-certification courses for family caregivers and working aides. Online lessons plus hands-on practice in person." photo={photos.instructor} />
      <section className="wrap mt-16">
        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {open.map((t) => (
            <li key={t.title} className="rounded-xl border border-line bg-white p-6">
              <h2 className="text-2xl">{t.title}</h2>
              <p className="mt-2 text-ink-soft">{t.desc}</p>
              <p className="mt-4 text-[0.9rem] font-semibold text-forest-800">Online and in person</p>
            </li>
          ))}
        </ul>
        <h2 className="mt-14 text-3xl">Coming later</h2>
        <ul className="mt-4 flex flex-wrap gap-3">
          {later.map((t) => <li key={t.title} className="rounded-full border border-line px-4 py-2">{t.title}</li>)}
        </ul>
      </section>
      <section className="wrap mt-16">
        <div className="rounded-2xl bg-linen p-6 sm:p-10">
          <h2 className="text-4xl">Get the next class dates</h2>
          <p className="mt-3 max-w-2xl text-ink-soft">Training a team? <a href="/organizations#proposal" className="font-semibold text-forest-800 underline">Request a group proposal</a> instead.</p>
          <div className="mt-6 max-w-2xl"><WaitlistForm list="specialty_training" cta="Email me the dates" source="specialty_page" /></div>
        </div>
      </section>
    </>
  );
}
