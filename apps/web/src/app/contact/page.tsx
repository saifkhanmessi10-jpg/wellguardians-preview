import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { site } from "@/content/site";

export const metadata: Metadata = { title: "Contact us", description: "Get in touch with WellGuardians. We reply within one business day." };

export default function ContactPage() {
  return (
    <section className="wrap mt-14 grid gap-14 lg:grid-cols-[1fr_1.4fr]">
      <div>
        <h1 className="text-5xl sm:text-6xl">Contact us</h1>
        <p className="mt-5 text-lg text-ink-soft">{site.replyPromise} If you'd rather talk it through, <Link href="/book" className="font-semibold text-forest-800 underline">book a free consultation</Link>.</p>
        <dl className="mt-10 space-y-5">
          <div><dt className="font-semibold">Email</dt><dd><a href={`mailto:${site.email}`} className="text-forest-800 underline">{site.email}</a></dd></div>
          {site.phone && <div><dt className="font-semibold">Phone</dt><dd><a href={`tel:${site.phone}`} className="text-forest-800 underline">{site.phone}</a></dd></div>}
          <div><dt className="font-semibold">Hours</dt><dd className="text-ink-soft">{site.hours}</dd></div>
          <div><dt className="font-semibold">Based in</dt><dd className="text-ink-soft">{site.region}, serving clients across the U.S.</dd></div>
        </dl>
        <p className="mt-10 rounded-lg border border-alert/30 bg-[#fbeeea] p-4 text-[0.95rem]">
          We're a non-clinical service. For a medical emergency call 911. For a mental health crisis call or text 988.
        </p>
      </div>
      <div className="rounded-2xl border border-line bg-white p-6 sm:p-8"><ContactForm /></div>
    </section>
  );
}
