import type { Metadata } from "next";
import { Suspense } from "react";
import { BookingFlow } from "@/components/booking/BookingFlow";

export const metadata: Metadata = {
  title: "Book a free consultation",
  description: "Book a free 45-minute consultation by video or phone. Weekday, evening and Saturday times.",
};

export default function BookPage() {
  return (
    <section className="wrap mt-12 grid gap-12 lg:grid-cols-[1fr_2fr]">
      <div>
        <h1 className="text-4xl sm:text-5xl">Book a free consultation</h1>
        <p className="mt-4 text-lg text-ink-soft">Forty-five minutes by video or phone. You tell us what's going on; we explain how we could help. No cost and no obligation.</p>
        <ul className="mt-8 hidden space-y-3 text-ink-soft lg:block">
          <li className="border-l-2 border-marigold pl-3">Weekday, evening and Saturday times</li>
          <li className="border-l-2 border-marigold pl-3">Confirmation and calendar invite by email</li>
          <li className="border-l-2 border-marigold pl-3">Cancel or reschedule from your confirmation email</li>
        </ul>
      </div>
      <div className="min-w-0">
        <Suspense fallback={<div aria-busy="true" className="h-96 animate-pulse rounded-xl bg-forest-50" />}>
          <BookingFlow />
        </Suspense>
      </div>
    </section>
  );
}
