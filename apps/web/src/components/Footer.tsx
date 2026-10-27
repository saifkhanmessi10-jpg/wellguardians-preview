import Link from "next/link";
import { disclaimer, site } from "@/content/site";
import { NewsletterForm } from "./forms";
import { Logo } from "./Logo";

const cols = [
  { h: "Get help", links: [["Book a free consultation", "/book"], ["Plans & pricing", "/plans"], ["FAQs", "/faq"], ["Contact", "/contact"]] },
  { h: "Services", links: [["Patient advocacy", "/advocacy/patient-advocacy-care-navigation"], ["Insurance & billing", "/advocacy/insurance-billing-advocacy"], ["Care coordination", "/advocacy/care-coordination"], ["For organizations", "/organizations"]] },
  { h: "Academy & shop", links: [["Georgia CNA program", "/academy/cna"], ["Specialty trainings", "/academy/specialty"], ["CPR & BLS", "/academy/cpr"], ["Care packages", "/shop"]] },
];

export function Footer() {
  return (
    <footer className="mt-24 bg-forest-950 text-forest-200">
      <div className="wrap grid gap-12 py-16 lg:grid-cols-[1.3fr_2fr]">
        <div>
          <Logo tone="light" />
          <p className="mt-4 max-w-sm text-[0.95rem]">Independent, non-clinical health advocacy for Georgia families and beyond.</p>
          <h2 className="mt-8 font-sans text-base font-semibold text-white">A short note for caregivers, once a month</h2>
          <div className="mt-3 max-w-md"><NewsletterForm tone="dark" /></div>
        </div>
        <div className="grid gap-8 sm:grid-cols-3">
          {cols.map((c) => (
            <nav key={c.h} aria-label={c.h}>
              <h2 className="font-sans text-base font-semibold text-white">{c.h}</h2>
              <ul className="mt-3 space-y-2 text-[0.95rem]">
                {c.links.map(([l, h]) => <li key={h}><Link href={h!} className="hover:text-white hover:underline">{l}</Link></li>)}
              </ul>
            </nav>
          ))}
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="wrap py-8 text-[0.85rem] leading-relaxed">
          <p className="max-w-4xl"><strong className="text-white">Disclaimer.</strong> {disclaimer} In an emergency, call 911. For a mental health crisis, call or text 988.</p>
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
            <span>© {new Date().getFullYear()} {site.legalName}</span>
            <Link href="/legal/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/legal/terms" className="hover:text-white">Terms</Link>
            <Link href="/legal/accessibility" className="hover:text-white">Accessibility</Link>
            <Link href="/legal/non-clinical-disclaimer" className="hover:text-white">Non-clinical disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
