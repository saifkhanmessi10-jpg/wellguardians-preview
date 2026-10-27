"use client";

import { useId, useState, type ReactNode } from "react";
import { CheckCircle2 } from "lucide-react";
import type { CreateLeadInput } from "@wg/shared";
import { api, ApiRequestError } from "@/lib/api";

type Status = { state: "idle" | "sending" | "done" } | { state: "error"; message: string; fields?: Record<string, string> };

export function useLead() {
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const submit = async (payload: CreateLeadInput) => {
    setStatus({ state: "sending" });
    try {
      await api("/leads", { method: "POST", body: JSON.stringify(payload) });
      setStatus({ state: "done" });
    } catch (e) {
      const err = e instanceof ApiRequestError ? e : new ApiRequestError(0, "unknown", "Something went wrong.");
      setStatus({ state: "error", message: err.message, fields: err.fields });
    }
  };
  const fieldError = (k: string) => (status.state === "error" ? status.fields?.[k] : undefined);
  return { status, submit, fieldError };
}

export function Field({ label, name, error, hint, children }: { label: string; name: string; error?: string; hint?: string; children: (p: { id: string; "aria-invalid"?: boolean; "aria-describedby"?: string }) => ReactNode }) {
  const id = useId() + name;
  const describedBy = [hint && `${id}-hint`, error && `${id}-err`].filter(Boolean).join(" ") || undefined;
  return (
    <div>
      <label htmlFor={id} className="field-label">{label}</label>
      {hint && <p id={`${id}-hint`} className="-mt-1 mb-1.5 text-[0.85rem] text-ink-soft">{hint}</p>}
      {children({ id, "aria-invalid": error ? true : undefined, "aria-describedby": describedBy })}
      {error && <p id={`${id}-err`} className="field-error">{error}</p>}
    </div>
  );
}

export function Honeypot() {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
      <label>Website<input type="text" name="website" tabIndex={-1} autoComplete="off" /></label>
    </div>
  );
}

export function FormError({ status }: { status: Status }) {
  if (status.state !== "error") return null;
  return <p role="alert" className="rounded-md border border-alert/40 bg-[#fbeeea] px-4 py-3 text-[0.95rem] text-alert">{status.message}</p>;
}

export function Success({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div role="status" className="rounded-lg border border-forest-200 bg-forest-50 p-6">
      <CheckCircle2 className="mb-3 size-7 text-ok" aria-hidden />
      <h3 className="text-2xl">{title}</h3>
      <div className="mt-2 text-ink-soft">{children}</div>
    </div>
  );
}

const fd = (f: HTMLFormElement) => new FormData(f);
const s = (d: FormData, k: string) => String(d.get(k) ?? "");

export function NewsletterForm({ tone = "light" }: { tone?: "light" | "dark" }) {
  const { status, submit, fieldError } = useLead();
  if (status.state === "done") return <p role="status" className={tone === "dark" ? "text-forest-200" : "text-ok"}>You're subscribed. Look out for our next caregiver note.</p>;
  return (
    <form
      noValidate
      className="relative flex flex-col gap-2 sm:flex-row"
      onSubmit={(e) => {
        e.preventDefault();
        const d = fd(e.currentTarget);
        submit({ kind: "newsletter", email: s(d, "email"), website: s(d, "website"), source: "footer" });
      }}
    >
      <Honeypot />
      <label htmlFor="nl-email" className="sr-only">Email address</label>
      <input id="nl-email" name="email" type="email" required autoComplete="email" placeholder="you@example.com" className="field min-h-12 flex-1" aria-invalid={fieldError("email") ? true : undefined} />
      <button className="btn-gold" disabled={status.state === "sending"}>{status.state === "sending" ? "Subscribing…" : "Subscribe"}</button>
      {status.state === "error" && <p role="alert" className="field-error w-full sm:absolute sm:top-full">{fieldError("email") ?? status.message}</p>}
    </form>
  );
}

export function WaitlistForm({ list, cta, source }: { list: "cna_cohort" | "specialty_training" | "care_packages" | "supplements"; cta: string; source: string }) {
  const { status, submit, fieldError } = useLead();
  if (status.state === "done") return <Success title="You're on the list">We'll email you as soon as there's news. No spam, and you can unsubscribe anytime.</Success>;
  return (
    <form
      noValidate
      className="relative grid gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        const d = fd(e.currentTarget);
        submit({ kind: "waitlist", list, name: s(d, "name") || undefined, email: s(d, "email"), website: s(d, "website"), source });
      }}
    >
      <Honeypot />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Your name" name="name">{(p) => <input {...p} name="name" autoComplete="name" className="field" />}</Field>
        <Field label="Email" name="email" error={fieldError("email")}>{(p) => <input {...p} name="email" type="email" required autoComplete="email" className="field" />}</Field>
      </div>
      <FormError status={status} />
      <div><button className="btn-primary" disabled={status.state === "sending"}>{status.state === "sending" ? "Joining…" : cta}</button></div>
    </form>
  );
}
