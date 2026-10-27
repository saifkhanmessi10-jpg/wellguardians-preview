# Architecture

## Shape

```
Browser ──► Web (Next.js, static pages on a CDN)
               │  /api/v1/*  (same-origin rewrite)
               ▼
            API (Express, stateless, N instances) ──► MongoDB Atlas (replica set)
               │
               └─► Notifier port ──► Postmark (email) / Twilio (SMS)   [phase 2]
```

## Why it scales and stays cheap

- **Static first.** All 33 public routes are prerendered at build time, so traffic spikes from ads or social posts hit the CDN, not a server. Only booking, availability and form posts reach the API.
- **Same-origin API.** The browser calls `/api/v1/*`; Next rewrites to the API. No CORS preflights, no public API hostname, and the API can move or scale without touching the frontend.
- **Stateless API.** No sessions in memory; any instance can serve any request. Scale horizontally behind a load balancer. Graceful shutdown drains requests on deploy.
- **Double booking is impossible, even across instances.** A booking first claims every 15-minute block it occupies (appointment + 15-minute buffer) in a `SlotLock` collection with a unique index. The database rejects the second writer atomically, so this needs no transactions or distributed locks. Covered by a test that fires 8 simultaneous bookings at one slot and expects exactly one to win.
- **Pure slot engine.** `generateSlots` is a pure function of rules + busy ranges, so it's unit-tested without a database and can be cached later if load ever demands it.
- **One validation contract.** Zod schemas in `packages/shared` validate the form in the browser and the request in the API. Error envelopes are uniform: `{ error: { code, message, fields } }`.
- **Indexes match the queries:** bookings by `(start, status)`, locks by unique `at`, leads by `createdAt` and `(kind, email, list)` for idempotent signups.

## Security and privacy

- Helmet headers, HSTS, 50 KB body limit, per-IP write rate limit, honeypot fields on every form.
- Logs redact email, phone, notes and contact objects.
- Booking manage links use a random 256-bit token; only its SHA-256 hash is stored.
- No ad pixels on booking or form pages. Stripe will only ever receive neutral product names and IDs, never health information.
- Forms tell people not to include diagnoses or ID numbers. Health documents will only be accepted through the authenticated portal.

## Roadmap

| Phase | Scope |
|---|---|
| 1 (this) | Public site, native booking, leads, CI, Docker |
| 2 | Owner dashboard (bookings, leads, availability blocks), Google Calendar busy-time sync, Postmark/Twilio notifications, reschedule flow |
| 3 | Client portal: auth (passkeys + 2FA for staff), intake and e-sign, secure messages, encrypted document uploads (S3 presigned + malware scan), Stripe Billing retainers, retainer hours meter, family access |
| 4 | Care package store: Stripe Checkout, variants (with / without scripture), build-your-box, fulfillment queue |
| 5 | Academy: cohorts, enrollment after DCH approval, modules, quizzes, skills checklist (critical steps), clinical hour logs, attendance make-ups |
| 6 | AI assistant for web chat, then Instagram/Facebook DMs after Meta App Review |

Each phase adds a new module under `apps/api/src/modules/<name>` with its own routes, service and models, and new routes under `apps/web/src/app`. Modules talk through services, not each other's models, so any one can later be split into its own service if needed.
