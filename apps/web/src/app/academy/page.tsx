import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand, PageHero } from "@/components/blocks";
import { Photo } from "@/components/Photo";
import { photos } from "@/content/site";

export const metadata: Metadata = {
  title: "WellGuardians Academy",
  description: "Georgia CNA training, specialty caregiver courses and CPR, taught by people who've done the work.",
};

const tracks = [
  { title: "Georgia CNA program", body: "85 hours: 61 classroom and lab hours plus 24 supervised clinical hours, preparing you for the Georgia NNAAP exam.", href: "/academy/cna", photo: photos.cohort, cta: "See the CNA program" },
  { title: "Specialty trainings", body: "Dementia, post-stroke, home ventilator, tracheostomy and PEG tube care for family caregivers and working aides.", href: "/academy/specialty", photo: photos.instructor, cta: "Browse specialty trainings" },
  { title: "CPR & BLS", body: "American Heart Association courses through our training-center partner.", href: "/academy/cpr", photo: photos.cpr, cta: "About CPR classes" },
];

export default function AcademyPage() {
  return (
    <>
      <PageHero title="WellGuardians Academy" lead="Hands-on care training taught by people who've done the work, for new nurse aides and for families caring for someone at home." photo={photos.skillsLab}>
        <Link href="/academy/cna" className="btn-primary">See the CNA program</Link>
        <Link href="/book?topic=training" className="btn-quiet">Talk to us about training</Link>
      </PageHero>
      <section className="wrap mt-20 grid gap-8 lg:grid-cols-3">
        {tracks.map((t) => (
          <article key={t.href} className="flex flex-col">
            <Photo photo={t.photo} className="aspect-[4/3] rounded-2xl" sizes="(min-width:1024px) 33vw, 100vw" />
            <h2 className="mt-5 text-3xl">{t.title}</h2>
            <p className="mt-2 flex-1 text-ink-soft">{t.body}</p>
            <Link href={t.href} className="btn-quiet mt-5 self-start">{t.cta}</Link>
          </article>
        ))}
      </section>
      <CtaBand title="Training your staff?" body="We deliver specialty trainings on-site or online for clinics, home-care agencies and senior living." />
    </>
  );
}
