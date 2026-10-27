"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CalendarPlus, CalendarX2 } from "lucide-react";
import { APPOINTMENT_TYPES, type AppointmentTypeId } from "@wg/shared";
import { api, ApiRequestError } from "@/lib/api";
import { fmtDay, fmtTime } from "@/lib/format";

interface View {
  reference: string;
  type: AppointmentTypeId;
  start: string;
  end: string;
  mode: "video" | "phone";
  status: "confirmed" | "cancelled" | "completed" | "no_show";
  firstName: string;
}

type State =
  | { s: "loading" }
  | { s: "error"; message: string }
  | { s: "ready"; b: View; confirming: boolean; working: boolean; actionError?: string };

export function ManageBooking({ token }: { token: string }) {
  const [state, setState] = useState<State>({ s: "loading" });
  const headingRef = useRef<HTMLHeadingElement>(null);
  const enc = encodeURIComponent(token);

  useEffect(() => {
    api<View>(`/bookings/manage/${enc}`)
      .then((b) => setState({ s: "ready", b, confirming: false, working: false }))
      .catch((e) => setState({ s: "error", message: e instanceof ApiRequestError ? e.message : "We couldn't load this booking." }));
  }, [enc]);

  async function cancel() {
    if (state.s !== "ready") return;
    setState({ ...state, working: true, actionError: undefined });
    try {
      await api(`/bookings/manage/${enc}/cancel`, { method: "POST" });
      setState({ ...state, b: { ...state.b, status: "cancelled" }, confirming: false, working: false });
      requestAnimationFrame(() => headingRef.current?.focus());
    } catch (e) {
      setState({ ...state, working: false, actionError: e instanceof ApiRequestError ? e.message : "The booking wasn't cancelled. Try again." });
    }
  }

  if (state.s === "loading")
    return <div aria-busy="true" className="h-72 animate-pulse rounded-xl bg-forest-50"><span className="sr-only">Loading your booking</span></div>;

  if (state.s === "error")
    return (
      <div>
        <h1 className="text-4xl sm:text-5xl">We couldn't find this booking</h1>
        <p className="mt-4 text-lg text-ink-soft">{state.message} If you need help, email info@wellguardians.com and include your reference number.</p>
        <Link href="/book" className="btn-primary mt-8">Book a free consultation</Link>
      </div>
    );

  const { b } = state;
  const meta = APPOINTMENT_TYPES[b.type];
  const cancelled = b.status === "cancelled";
  const past = new Date(b.start).getTime() < Date.now();

  return (
    <div>
      <h1 ref={headingRef} tabIndex={-1} className="text-4xl outline-none sm:text-5xl">
        {cancelled ? "Your booking is cancelled" : `Hi ${b.firstName}, here's your booking`}
      </h1>
      {cancelled && <p role="status" className="mt-4 text-lg text-ink-soft">Nothing more to do. Whenever you're ready, you can book a new time.</p>}

      <dl className="mt-8 divide-y divide-line rounded-xl border border-line bg-white">
        {[
          ["Appointment", meta.label],
          ["When", `${fmtDay(b.start)}, ${fmtTime(b.start)} Eastern`],
          ["How", b.mode === "video" ? "Video call (link arrives by email)" : "Phone call to the number you gave us"],
          ["Reference", b.reference],
          ["Status", cancelled ? "Cancelled" : past ? "Past" : "Confirmed"],
        ].map(([k, v]) => (
          <div key={k} className="flex flex-wrap justify-between gap-2 px-5 py-3.5">
            <dt className="text-ink-soft">{k}</dt>
            <dd className={k === "When" && cancelled ? "font-semibold line-through" : "font-semibold"}>{v}</dd>
          </div>
        ))}
      </dl>

      {!cancelled && !past && (
        <div className="mt-8 flex flex-wrap gap-3">
          <a href={`/api/v1/bookings/manage/${enc}/calendar.ics`} className="btn-primary"><CalendarPlus className="size-5" aria-hidden /> Add to my calendar</a>
          {!state.confirming && (
            <button type="button" className="btn-quiet" onClick={() => setState({ ...state, confirming: true })}>
              <CalendarX2 className="size-5" aria-hidden /> Cancel or change time
            </button>
          )}
        </div>
      )}

      {state.confirming && !cancelled && (
        <div role="alertdialog" aria-labelledby="cx-h" aria-describedby="cx-d" className="mt-6 rounded-xl border border-alert/40 bg-[#fbeeea] p-5 sm:p-6">
          <h2 id="cx-h" className="text-2xl">Cancel this appointment?</h2>
          <p id="cx-d" className="mt-2 text-ink-soft">To change the time, cancel here and then pick a new time. Your current slot is released straight away.</p>
          {state.actionError && <p role="alert" className="mt-3 font-medium text-alert">{state.actionError}</p>}
          <div className="mt-5 flex flex-wrap gap-3">
            <button type="button" className="btn-primary bg-alert hover:bg-[#8a2918]" onClick={cancel} disabled={state.working} autoFocus>
              {state.working ? "Cancelling…" : "Cancel appointment"}
            </button>
            <button type="button" className="btn-quiet" onClick={() => setState({ ...state, confirming: false })}>Keep appointment</button>
          </div>
        </div>
      )}

      {(cancelled || past) && <Link href="/book" className="btn-primary mt-8">Book a new time</Link>}
    </div>
  );
}
