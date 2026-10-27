"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import clsx from "clsx";
import { CalendarCheck2, CalendarPlus, Phone, Video } from "lucide-react";
import {
  APPOINTMENT_TYPES,
  BUSINESS_TIMEZONE,
  TOPICS,
  type AppointmentTypeId,
  type AvailabilityResponse,
  type BookingConfirmation,
  type CreateBookingInput,
  type Slot,
} from "@wg/shared";
import { api, ApiRequestError } from "@/lib/api";
import { fmtDay, fmtTime } from "@/lib/format";
import { Field } from "../forms";

const STEPS = ["What's going on", "Pick a time", "Your details", "Confirm"] as const;
const WINDOWS: { id: Slot["window"] | "all"; label: string }[] = [
  { id: "all", label: "Any time" },
  { id: "weekday_day", label: "Weekday daytime" },
  { id: "evening", label: "Evenings" },
  { id: "weekend", label: "Saturdays" },
];

const typeForTopic = (topic: string): AppointmentTypeId =>
  topic === "organization" ? "org_discovery" : topic === "training" ? "academy_info" : "consultation";

const todayYmd = () => new Intl.DateTimeFormat("en-CA", { timeZone: BUSINESS_TIMEZONE }).format(new Date());
const addDays = (ymd: string, n: number) => {
  const d = new Date(ymd + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};

type Contact = CreateBookingInput["contact"];

export function BookingFlow() {
  const params = useSearchParams();
  const initialTopic = TOPICS.some((t) => t.id === params.get("topic")) ? params.get("topic")! : "";

  const [step, setStep] = useState(initialTopic ? 1 : 0);
  const [topic, setTopic] = useState(initialTopic);
  const type = typeForTopic(topic);
  const meta = APPOINTMENT_TYPES[type];

  const [from, setFrom] = useState(todayYmd);
  const [avail, setAvail] = useState<AvailabilityResponse | null>(null);
  const [availError, setAvailError] = useState<string | null>(null);
  const [day, setDay] = useState<string | null>(null);
  const [window, setWindow] = useState<(typeof WINDOWS)[number]["id"]>("all");
  const [slot, setSlot] = useState<Slot | null>(null);
  const [mode, setMode] = useState<"video" | "phone">("video");

  const [contact, setContact] = useState<Contact>({ firstName: "", lastName: "", email: "", phone: "", preferredContact: "email" });
  const [notes, setNotes] = useState("");
  const [smsOptIn, setSmsOptIn] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<BookingConfirmation | null>(null);

  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    headingRef.current?.focus();
  }, [step, confirmation]);

  const loadAvailability = useCallback(async () => {
    setAvail(null);
    setAvailError(null);
    try {
      const res = await api<AvailabilityResponse>(`/availability?type=${type}&from=${from}&days=14`);
      setAvail(res);
      setDay((d) => (d && res.days.some((x) => x.date === d && x.slots.length) ? d : res.days.find((x) => x.slots.length)?.date ?? null));
    } catch (e) {
      setAvailError(e instanceof ApiRequestError ? e.message : "We couldn't load available times.");
    }
  }, [type, from]);

  useEffect(() => {
    if (step === 1) void loadAvailability();
  }, [step, loadAvailability]);

  const daySlots = useMemo(() => {
    const d = avail?.days.find((x) => x.date === day);
    return (d?.slots ?? []).filter((s) => window === "all" || s.window === window);
  }, [avail, day, window]);

  const localTz = typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : BUSINESS_TIMEZONE;
  const showLocal = localTz !== BUSINESS_TIMEZONE;

  function validateDetails() {
    const e: Record<string, string> = {};
    if (!contact.firstName.trim()) e["contact.firstName"] = "Enter your first name";
    if (!contact.lastName.trim()) e["contact.lastName"] = "Enter your last name";
    if (!/^\S+@\S+\.\S+$/.test(contact.email)) e["contact.email"] = "Enter a valid email address";
    if (contact.phone.replace(/\D/g, "").length < 10) e["contact.phone"] = "Enter a phone number with at least 10 digits";
    if (!accepted) e.acceptedDisclaimer = "Please confirm you understand our services are non-clinical";
    setFieldErrors(e);
    return Object.keys(e).length === 0;
  }

  async function confirm() {
    if (!slot) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const body: CreateBookingInput = {
        type, topic, start: slot.start, mode, contact, notes, smsOptIn,
        acceptedDisclaimer: true, clientTimezone: localTz, website: "",
      };
      setConfirmation(await api<BookingConfirmation>("/bookings", { method: "POST", body: JSON.stringify(body) }));
    } catch (e) {
      if (e instanceof ApiRequestError && e.code === "slot_unavailable") {
        setSlot(null);
        setStep(1);
        setSubmitError(e.message);
        void loadAvailability();
      } else if (e instanceof ApiRequestError && e.fields) {
        setFieldErrors(e.fields);
        setStep(2);
      } else {
        setSubmitError(e instanceof Error ? e.message : "Something went wrong.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  /* ------------------------------ success ------------------------------ */
  if (confirmation) {
    const ics = `/api/v1/bookings/manage/${confirmation.manageToken}/calendar.ics`;
    return (
      <section aria-labelledby="done-h" className="rounded-xl border border-forest-200 bg-white p-6 sm:p-10">
        <CalendarCheck2 className="mb-4 size-9 text-ok" aria-hidden />
        <h2 id="done-h" ref={headingRef} tabIndex={-1} className="text-4xl outline-none">You're booked, {contact.firstName}.</h2>
        <p className="mt-3 text-lg text-ink-soft">
          {meta.label} on <strong className="text-ink">{fmtDay(confirmation.start)}</strong> at{" "}
          <strong className="text-ink">{fmtTime(confirmation.start)} Eastern</strong>, by {confirmation.mode === "video" ? "video" : "phone"}.
        </p>
        <p className="mt-1 text-ink-soft">Your reference is <strong className="text-ink">{confirmation.reference}</strong>. A confirmation is on its way to {contact.email}.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href={ics} className="btn-primary"><CalendarPlus className="size-5" aria-hidden /> Add to my calendar</a>
          <Link href="/" className="btn-quiet">Back to home</Link>
        </div>
        <div className="mt-8 rounded-lg bg-linen p-5">
          <h3 className="text-xl">What to have ready</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-ink-soft">
            <li>Your insurance card, or a photo of it</li>
            <li>Any recent bills or letters you have questions about</li>
            <li>A list of current medications and providers</li>
            <li>The questions you most want answered</li>
          </ul>
        </div>
      </section>
    );
  }

  /* -------------------------------- steps ------------------------------ */
  return (
    <div>
      <ol className="mb-8 grid grid-cols-4 gap-2" aria-label="Booking progress">
        {STEPS.map((label, i) => (
          <li key={label} aria-current={i === step ? "step" : undefined}>
            <div className={clsx("h-1.5 rounded-full", i <= step ? "bg-forest-800" : "bg-line")} />
            <span className={clsx("mt-2 hidden text-[0.85rem] sm:block", i === step ? "font-semibold text-forest-900" : "text-ink-soft")}>{label}</span>
          </li>
        ))}
      </ol>

      <section aria-labelledby="step-h" className="rounded-xl border border-line bg-white p-5 sm:p-8">
        <h2 id="step-h" ref={headingRef} tabIndex={-1} className="text-3xl outline-none">
          <span className="sr-only">Step {step + 1} of 4: </span>
          {["What can we help with?", "Pick a time that works", "How can we reach you?", "Check and confirm"][step]}
        </h2>

        {step === 0 && (
          <fieldset className="mt-6">
            <legend className="sr-only">Choose a topic</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {TOPICS.map((t) => (
                <label key={t.id} className="flex min-h-14 cursor-pointer items-center gap-3 rounded-lg border border-line p-4 hover:border-forest-600 has-[:checked]:border-forest-800 has-[:checked]:bg-forest-50">
                  <input type="radio" name="topic" value={t.id} checked={topic === t.id} onChange={() => setTopic(t.id)} className="size-4 accent-forest-800" />
                  <span className="font-medium">{t.label}</span>
                </label>
              ))}
            </div>
            {topic && (
              <p className="mt-5 rounded-md bg-linen px-4 py-3 text-ink-soft">
                You'll book a <strong className="text-ink">{meta.label.toLowerCase()}</strong>: {meta.description}
              </p>
            )}
            <div className="mt-6">
              <button type="button" className="btn-primary" disabled={!topic} onClick={() => setStep(1)}>Continue</button>
            </div>
          </fieldset>
        )}

        {step === 1 && (
          <div className="mt-6">
            {submitError && <p role="alert" className="mb-5 rounded-md border border-alert/40 bg-[#fbeeea] px-4 py-3 text-alert">{submitError}</p>}
            <p className="text-ink-soft">
              {meta.durationMin} minutes. Times are shown in Eastern Time{showLocal ? `, with your local time (${localTz.replace("_", " ")}) underneath` : ""}.
            </p>

            <fieldset className="mt-5">
              <legend className="field-label">How would you like to talk?</legend>
              <div className="flex flex-wrap gap-2">
                {([["video", "Video call", Video], ["phone", "Phone call", Phone]] as const).map(([v, l, Icon]) => (
                  <label key={v} className="flex min-h-12 cursor-pointer items-center gap-2 rounded-full border border-line px-5 has-[:checked]:border-forest-800 has-[:checked]:bg-forest-800 has-[:checked]:text-white">
                    <input type="radio" name="mode" value={v} checked={mode === v} onChange={() => setMode(v)} className="sr-only" />
                    <Icon className="size-4" aria-hidden /> {l}
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Filter times">
              {WINDOWS.map((w) => (
                <button key={w.id} type="button" aria-pressed={window === w.id} onClick={() => setWindow(w.id)}
                  className={clsx("min-h-10 rounded-full border px-4 text-[0.9rem]", window === w.id ? "border-forest-800 bg-forest-50 font-semibold text-forest-900" : "border-line")}>
                  {w.label}
                </button>
              ))}
            </div>

            {availError && (
              <div role="alert" className="mt-6 rounded-md border border-alert/40 bg-[#fbeeea] p-4 text-alert">
                {availError} <button type="button" className="ml-2 font-semibold underline" onClick={() => void loadAvailability()}>Try again</button>
              </div>
            )}

            {!avail && !availError && (
              <div aria-busy="true" aria-live="polite" className="mt-6 grid gap-3">
                <span className="sr-only">Loading available times</span>
                <div className="h-16 animate-pulse rounded-lg bg-forest-50" />
                <div className="h-32 animate-pulse rounded-lg bg-forest-50" />
              </div>
            )}

            {avail && (
              <>
                <div className="mt-6 flex items-center justify-between gap-3">
                  <button type="button" className="btn-quiet min-h-10 px-4 text-sm" disabled={from <= todayYmd()} onClick={() => setFrom(addDays(from, -14))}>Earlier dates</button>
                  <button type="button" className="btn-quiet min-h-10 px-4 text-sm" onClick={() => setFrom(addDays(from, 14))}>Later dates</button>
                </div>
                <div role="radiogroup" aria-label="Choose a day" className="mt-3 flex snap-x gap-2 overflow-x-auto pb-2">
                  {avail.days.map((d) => {
                    const count = d.slots.filter((s) => window === "all" || s.window === window).length;
                    const dt = new Date(d.date + "T12:00:00Z");
                    return (
                      <button key={d.date} type="button" role="radio" aria-checked={day === d.date} disabled={!count} onClick={() => { setDay(d.date); setSlot(null); }}
                        aria-label={`${new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric", timeZone: "UTC" }).format(dt)}, ${count ? `${count} times` : "no times"}`}
                        className={clsx("flex w-[4.5rem] shrink-0 snap-start flex-col items-center rounded-lg border py-2.5 disabled:opacity-35",
                          day === d.date ? "border-forest-800 bg-forest-800 text-white" : "border-line bg-paper hover:border-forest-600")}>
                        <span className="text-[0.75rem]">{new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone: "UTC" }).format(dt)}</span>
                        <span className="font-display text-2xl leading-tight">{dt.getUTCDate()}</span>
                        <span className="text-[0.7rem]">{new Intl.DateTimeFormat("en-US", { month: "short", timeZone: "UTC" }).format(dt)}</span>
                      </button>
                    );
                  })}
                </div>

                {day && daySlots.length > 0 ? (
                  <div role="radiogroup" aria-label={`Times on ${fmtDay(daySlots[0]!.start)}`} className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {daySlots.map((s) => (
                      <button key={s.start} type="button" role="radio" aria-checked={slot?.start === s.start} onClick={() => setSlot(s)}
                        className={clsx("min-h-14 rounded-lg border px-3 py-2 text-left", slot?.start === s.start ? "border-forest-800 bg-forest-800 text-white" : "border-line hover:border-forest-600")}>
                        <span className="block font-semibold">{fmtTime(s.start)}</span>
                        {showLocal && <span className="block text-[0.75rem] opacity-80">{fmtTime(s.start, localTz)} your time</span>}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 rounded-md bg-linen px-4 py-3 text-ink-soft">
                    No {window === "all" ? "" : WINDOWS.find((w) => w.id === window)!.label.toLowerCase() + " "}times in these two weeks. Try another filter or later dates, or{" "}
                    <Link href="/contact" className="font-semibold text-forest-800 underline">send us a message</Link> and we'll find a time.
                  </p>
                )}
              </>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              <button type="button" className="btn-quiet" onClick={() => setStep(0)}>Back</button>
              <button type="button" className="btn-primary" disabled={!slot} onClick={() => { setSubmitError(null); setStep(2); }}>Continue</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <form noValidate className="mt-6 grid gap-5" onSubmit={(e) => { e.preventDefault(); if (validateDetails()) setStep(3); }}>
            {Object.keys(fieldErrors).length > 0 && (
              <p role="alert" className="rounded-md border border-alert/40 bg-[#fbeeea] px-4 py-3 text-alert">Please fix the {Object.keys(fieldErrors).length === 1 ? "field" : `${Object.keys(fieldErrors).length} fields`} marked below.</p>
            )}
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="First name" name="firstName" error={fieldErrors["contact.firstName"]}>{(p) => <input {...p} className="field" autoComplete="given-name" value={contact.firstName} onChange={(e) => setContact({ ...contact, firstName: e.target.value })} />}</Field>
              <Field label="Last name" name="lastName" error={fieldErrors["contact.lastName"]}>{(p) => <input {...p} className="field" autoComplete="family-name" value={contact.lastName} onChange={(e) => setContact({ ...contact, lastName: e.target.value })} />}</Field>
              <Field label="Email" name="email" error={fieldErrors["contact.email"]}>{(p) => <input {...p} type="email" className="field" autoComplete="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} />}</Field>
              <Field label="Mobile phone" name="phone" error={fieldErrors["contact.phone"]}>{(p) => <input {...p} type="tel" className="field" autoComplete="tel" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} />}</Field>
            </div>
            <Field label="Best way to reach you" name="preferredContact">
              {(p) => (
                <select {...p} className="field sm:max-w-xs" value={contact.preferredContact} onChange={(e) => setContact({ ...contact, preferredContact: e.target.value as Contact["preferredContact"] })}>
                  <option value="email">Email</option><option value="phone">Phone call</option><option value="text">Text message</option>
                </select>
              )}
            </Field>
            <Field label="Anything you'd like us to know? (optional)" name="notes" hint="A sentence or two is plenty. Please leave out diagnoses, medical record numbers and insurance ID numbers. We'll go through details together on the call.">
              {(p) => <textarea {...p} rows={4} maxLength={1000} className="field" value={notes} onChange={(e) => setNotes(e.target.value)} />}
            </Field>
            <label className="flex items-start gap-3">
              <input type="checkbox" checked={smsOptIn} onChange={(e) => setSmsOptIn(e.target.checked)} className="mt-1 size-5 accent-forest-800" />
              <span className="text-ink-soft">Text me appointment reminders. Message and data rates may apply. Reply STOP to opt out.</span>
            </label>
            <div>
              <label className="flex items-start gap-3">
                <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} aria-invalid={fieldErrors.acceptedDisclaimer ? true : undefined} aria-describedby={fieldErrors.acceptedDisclaimer ? "disc-err" : undefined} className="mt-1 size-5 accent-forest-800" />
                <span>I understand WellGuardians provides non-clinical advocacy and education, not medical, nursing or legal advice. In an emergency I'll call 911.</span>
              </label>
              {fieldErrors.acceptedDisclaimer && <p id="disc-err" className="field-error ml-8">{fieldErrors.acceptedDisclaimer}</p>}
            </div>
            <div className="flex flex-wrap gap-3">
              <button type="button" className="btn-quiet" onClick={() => setStep(1)}>Back</button>
              <button className="btn-primary">Review booking</button>
            </div>
          </form>
        )}

        {step === 3 && slot && (
          <div className="mt-6">
            <dl className="divide-y divide-line rounded-lg border border-line">
              {[
                ["Appointment", meta.label, 0],
                ["When", `${fmtDay(slot.start)}, ${fmtTime(slot.start)} Eastern`, 1],
                ["How", mode === "video" ? "Video call (link sent by email)" : `Phone call to ${contact.phone}`, 1],
                ["Name", `${contact.firstName} ${contact.lastName}`, 2],
                ["Email", contact.email, 2],
              ].map(([k, v, s]) => (
                <div key={k as string} className="flex flex-wrap items-baseline justify-between gap-2 px-4 py-3">
                  <dt className="text-ink-soft">{k}</dt>
                  <dd className="flex items-baseline gap-3 font-semibold">
                    {v}
                    <button type="button" className="text-[0.85rem] font-normal text-forest-800 underline" onClick={() => setStep(s as number)}>Change<span className="sr-only"> {String(k).toLowerCase()}</span></button>
                  </dd>
                </div>
              ))}
            </dl>
            {submitError && <p role="alert" className="mt-5 rounded-md border border-alert/40 bg-[#fbeeea] px-4 py-3 text-alert">{submitError}</p>}
            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" className="btn-quiet" onClick={() => setStep(2)}>Back</button>
              <button type="button" className="btn-gold" onClick={confirm} disabled={submitting} aria-busy={submitting}>
                {submitting ? "Booking…" : `Confirm my ${meta.priceCents === 0 ? "free " : ""}${type === "consultation" ? "consultation" : "call"}`}
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
