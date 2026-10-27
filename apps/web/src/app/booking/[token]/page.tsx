import type { Metadata } from "next";
import { ManageBooking } from "@/components/booking/ManageBooking";

// Private link: keep it out of search engines and don't leak the token via Referer.
export const metadata: Metadata = { title: "Your booking", robots: { index: false, follow: false }, referrer: "no-referrer" };

export default async function ManageBookingPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return (
    <section className="wrap mt-12 max-w-3xl">
      <ManageBooking token={token} />
    </section>
  );
}
