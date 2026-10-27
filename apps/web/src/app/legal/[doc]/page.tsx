import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { disclaimer, site } from "@/content/site";

const docs: Record<string, { title: string; body: string[] }> = {
  privacy: { title: "Privacy policy", body: ["TODO(counsel): attorney-reviewed privacy policy.", "We don't run advertising trackers on booking, intake or account pages, and we never send health details to our payment processor."] },
  terms: { title: "Terms of service", body: ["TODO(counsel): attorney-reviewed terms of service."] },
  accessibility: { title: "Accessibility statement", body: [`${site.name} aims to meet WCAG 2.2 Level AA. If anything on this site is hard to use, email ${site.email} and we'll help and fix it.`] },
  "non-clinical-disclaimer": { title: "Non-clinical disclaimer", body: [disclaimer, "We work alongside your licensed providers to support communication, coordination, and decision-making. In an emergency, call 911. For a mental health crisis, call or text 988."] },
};

export const dynamicParams = false;
export const generateStaticParams = () => Object.keys(docs).map((doc) => ({ doc }));
export async function generateMetadata({ params }: { params: Promise<{ doc: string }> }): Promise<Metadata> {
  const d = docs[(await params).doc];
  return d ? { title: d.title } : {};
}

export default async function LegalPage({ params }: { params: Promise<{ doc: string }> }) {
  const d = docs[(await params).doc];
  if (!d) notFound();
  return (
    <article className="wrap mt-14 prose-wg">
      <h1 className="text-5xl">{d.title}</h1>
      {d.body.map((p) => <p key={p} className="mt-6 text-lg">{p}</p>)}
    </article>
  );
}
