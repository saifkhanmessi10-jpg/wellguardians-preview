import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/blocks";

export const metadata: Metadata = { title: "Client stories", robots: { index: false } };

/**
 * Intentionally empty. Testimonials publish only from verified clients with written
 * consent on file (FTC 16 CFR Part 465). TODO(sabine): supply consented testimonials.
 */
export default function TestimonialsPage() {
  return (
    <>
      <PageHero title="Client stories" lead="We're gathering stories from clients who've agreed to share them. Check back soon." />
      <section className="wrap mt-12">
        <Link href="/book" className="btn-primary">Book a free consultation</Link>
      </section>
    </>
  );
}
