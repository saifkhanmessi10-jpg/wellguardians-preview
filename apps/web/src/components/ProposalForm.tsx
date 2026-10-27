"use client";

import { useState } from "react";
import { Field, FormError, Honeypot, Success, useLead } from "./forms";

const needs = [
  ["staff_training", "Staff training (dementia, post-stroke, trach, PEG, vent)"],
  ["quality_improvement", "Quality improvement"],
  ["program_development", "Program development"],
  ["patient_advocacy_program", "Patient advocacy for our clients"],
  ["community_workshops", "Community health workshops"],
  ["other", "Something else"],
] as const;

export function ProposalForm() {
  const { status, submit, fieldError } = useLead();
  const [step, setStep] = useState<1 | 2>(1);
  if (status.state === "done")
    return <Success title="Request received">Sabine will reply within one business day to set up a discovery call and prepare your proposal.</Success>;

  return (
    <form
      noValidate
      className="relative grid gap-5"
      onSubmit={(e) => {
        e.preventDefault();
        const f = e.currentTarget;
        if (step === 1) {
          if (!f.reportValidity()) return;
          setStep(2);
          return;
        }
        const d = new FormData(f);
        submit({
          kind: "proposal",
          name: String(d.get("name")),
          email: String(d.get("email")),
          phone: String(d.get("phone") ?? "") || undefined,
          organization: String(d.get("organization")),
          orgType: String(d.get("orgType")) as "clinic",
          size: String(d.get("size")) as "1-10",
          needs: d.getAll("needs").map(String) as ["staff_training"],
          timeline: String(d.get("timeline")) as "exploring",
          details: String(d.get("details") ?? ""),
          website: String(d.get("website") ?? ""),
          source: "organizations_page",
        });
      }}
    >
      <Honeypot />
      <p className="text-[0.9rem] font-semibold text-ink-soft">Step {step} of 2: {step === 1 ? "Your organization" : "What you need"}</p>

      <div hidden={step !== 1} className="grid gap-5">
        <Field label="Organization name" name="organization" error={fieldError("organization")}>{(p) => <input {...p} name="organization" required autoComplete="organization" className="field" />}</Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Type of organization" name="orgType">
            {(p) => (
              <select {...p} name="orgType" className="field" defaultValue="clinic">
                <option value="clinic">Clinic or practice</option>
                <option value="senior_living">Senior living or long-term care</option>
                <option value="home_care">Home care agency</option>
                <option value="hospital">Hospital or health system</option>
                <option value="faith_community">Church or community group</option>
                <option value="other">Other</option>
              </select>
            )}
          </Field>
          <Field label="Number of staff" name="size">
            {(p) => (
              <select {...p} name="size" className="field" defaultValue="11-50">
                <option>1-10</option><option>11-50</option><option>51-200</option><option>200+</option>
              </select>
            )}
          </Field>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Your name" name="name" error={fieldError("name")}>{(p) => <input {...p} name="name" required autoComplete="name" className="field" />}</Field>
          <Field label="Work email" name="email" error={fieldError("email")}>{(p) => <input {...p} name="email" type="email" required autoComplete="email" className="field" />}</Field>
        </div>
        <Field label="Phone (optional)" name="phone">{(p) => <input {...p} name="phone" type="tel" autoComplete="tel" className="field" />}</Field>
      </div>

      <div hidden={step !== 2} className="grid gap-5">
        <fieldset>
          <legend className="field-label">What do you need help with?</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {needs.map(([v, l]) => (
              <label key={v} className="flex min-h-12 cursor-pointer items-start gap-3 rounded-md border border-line bg-white p-3 has-[:checked]:border-forest-800 has-[:checked]:bg-forest-50">
                <input type="checkbox" name="needs" value={v} className="mt-1 size-4 accent-forest-800" /> <span>{l}</span>
              </label>
            ))}
          </div>
          {fieldError("needs") && <p className="field-error">{fieldError("needs")}</p>}
        </fieldset>
        <Field label="Timeline" name="timeline">
          {(p) => (
            <select {...p} name="timeline" className="field" defaultValue="3-6m">
              <option value="0-3m">In the next 3 months</option>
              <option value="3-6m">In 3 to 6 months</option>
              <option value="exploring">Just exploring</option>
            </select>
          )}
        </Field>
        <Field label="Anything else we should know? (optional)" name="details">{(p) => <textarea {...p} name="details" rows={4} className="field" />}</Field>
      </div>

      <FormError status={status} />
      <div className="flex flex-wrap gap-3">
        {step === 2 && <button type="button" className="btn-quiet" onClick={() => setStep(1)}>Back</button>}
        <button className="btn-primary" disabled={status.state === "sending"}>
          {step === 1 ? "Continue" : status.state === "sending" ? "Sending…" : "Send my request"}
        </button>
      </div>
    </form>
  );
}
