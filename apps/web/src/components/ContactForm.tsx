"use client";

import { Field, FormError, Honeypot, Success, useLead } from "./forms";

const topics = [
  ["advocacy", "Advocacy for me or a family member"],
  ["billing", "A bill or insurance question"],
  ["academy", "Academy and training"],
  ["care_packages", "Care packages"],
  ["organizations", "My organization"],
  ["other", "Something else"],
] as const;

export function ContactForm() {
  const { status, submit, fieldError } = useLead();
  if (status.state === "done") return <Success title="Message sent">Thanks for reaching out. We reply within one business day.</Success>;
  return (
    <form
      noValidate
      className="relative grid gap-5"
      onSubmit={(e) => {
        e.preventDefault();
        const d = new FormData(e.currentTarget);
        submit({
          kind: "contact",
          name: String(d.get("name") ?? ""),
          email: String(d.get("email") ?? ""),
          topic: String(d.get("topic") ?? "other") as (typeof topics)[number][0],
          message: String(d.get("message") ?? ""),
          website: String(d.get("website") ?? ""),
          source: "contact_page",
        });
      }}
    >
      <Honeypot />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" name="name" error={fieldError("name")}>{(p) => <input {...p} name="name" required autoComplete="name" className="field" />}</Field>
        <Field label="Email" name="email" error={fieldError("email")}>{(p) => <input {...p} name="email" type="email" required autoComplete="email" className="field" />}</Field>
      </div>
      <Field label="What's this about?" name="topic">
        {(p) => (
          <select {...p} name="topic" className="field" defaultValue="advocacy">
            {topics.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        )}
      </Field>
      <Field label="Message" name="message" error={fieldError("message")} hint="Please don't include diagnoses, medical record numbers or insurance ID numbers here.">
        {(p) => <textarea {...p} name="message" required rows={6} className="field" />}
      </Field>
      <FormError status={status} />
      <div><button className="btn-primary" disabled={status.state === "sending"}>{status.state === "sending" ? "Sending…" : "Send message"}</button></div>
    </form>
  );
}
