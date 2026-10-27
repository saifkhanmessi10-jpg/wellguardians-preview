import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/blocks";
import { Photo } from "@/components/Photo";
import { articles } from "@/content/articles";
import { fmtDate } from "@/lib/format";

export const metadata: Metadata = { title: "Blog", description: "Guides for patients, caregivers and families navigating healthcare." };

export default function BlogPage() {
  const sorted = [...articles].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <>
      <PageHero title="The WellGuardians blog" lead="Plain-language guides for patients, caregivers and families navigating the healthcare system." />
      <section className="wrap mt-16 grid gap-10 md:grid-cols-3">
        {sorted.map((a) => (
          <article key={a.slug}>
            <Link href={`/blog/${a.slug}`} className="group block">
              <Photo photo={a.photo} className="aspect-[3/2] rounded-xl" sizes="(min-width:768px) 33vw, 100vw" />
              <p className="mt-4 text-[0.85rem] text-ink-soft"><time dateTime={a.date}>{fmtDate(a.date)}</time></p>
              <h2 className="mt-1 text-2xl group-hover:text-forest-600">{a.title}</h2>
              <p className="mt-2 text-ink-soft">{a.excerpt}</p>
            </Link>
          </article>
        ))}
      </section>
    </>
  );
}
