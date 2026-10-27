import Link from "next/link";

export default function NotFound() {
  return (
    <section className="wrap mt-20 max-w-2xl">
      <h1 className="text-5xl">We couldn't find that page</h1>
      <p className="mt-4 text-lg text-ink-soft">The link may be out of date. Try the home page, or book a free call and tell us what you were looking for.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/" className="btn-primary">Go to the home page</Link>
        <Link href="/book" className="btn-quiet">Book a free consultation</Link>
      </div>
    </section>
  );
}
