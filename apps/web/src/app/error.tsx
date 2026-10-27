"use client";

import Link from "next/link";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="wrap mt-20 max-w-2xl">
      <h1 className="text-5xl">This page didn't load</h1>
      <p className="mt-4 text-lg text-ink-soft">Your information is safe. Try again, or email info@wellguardians.com if it keeps happening.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <button type="button" onClick={reset} className="btn-primary">Try again</button>
        <Link href="/" className="btn-quiet">Go to the home page</Link>
      </div>
    </section>
  );
}
