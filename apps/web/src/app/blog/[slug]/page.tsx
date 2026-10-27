import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaBand } from "@/components/blocks";
import { Photo } from "@/components/Photo";
import { articles, getArticle } from "@/content/articles";
import { fmtDate } from "@/lib/format";

export const dynamicParams = false;
export const generateStaticParams = () => articles.map((a) => ({ slug: a.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const a = getArticle((await params).slug);
  return a ? { title: a.title, description: a.excerpt, openGraph: { type: "article", images: [a.photo.src] } } : {};
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const a = getArticle((await params).slug);
  if (!a) notFound();
  return (
    <>
      <article className="wrap mt-14">
        <Link href="/blog" className="text-[0.95rem] font-semibold text-forest-800 underline">All articles</Link>
        <header className="mt-6 max-w-3xl">
          <p className="text-ink-soft"><time dateTime={a.date}>{fmtDate(a.date)}</time></p>
          <h1 className="mt-2 text-5xl sm:text-6xl">{a.title}</h1>
        </header>
        <Photo photo={a.photo} priority className="mt-10 aspect-[21/9] rounded-2xl" sizes="100vw" />
        <div className="prose-wg mx-auto mt-12 text-lg">
          {a.body.map((b, i) => (
            <div key={i}>
              {b.h && <h2>{b.h}</h2>}
              <p>{b.p}</p>
            </div>
          ))}
        </div>
      </article>
      <CtaBand title="Need help with this?" body="Book a free 45-minute consultation and we'll look at your situation together." />
    </>
  );
}
