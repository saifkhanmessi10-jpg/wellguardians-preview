# WellGuardians Platform

The new platform for **WellGuardians Health and Advocacy Consultants, LLC**, replacing the WordPress site at wellguardians.com.

Phase 1 (this release): the public website and native booking for the free 45-minute consultation, plus contact, organization proposal, cohort waitlist and newsletter capture.

| | |
|---|---|
| `apps/web` | Next.js 16 (App Router, React 19, Tailwind v4). Every public page is statically prerendered. |
| `apps/api` | Express 5 + MongoDB (Mongoose) REST API, versioned under `/v1`. |
| `packages/shared` | Zod schemas and constants shared by web and API, so validation rules exist once. |

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for how it scales and the roadmap for the portals.

## Run it locally

Requirements: Node 22, and either Docker or nothing else (a throwaway MongoDB can run in-process).

```bash
npm install
npm run build -w @wg/shared

# Option A: everything in Docker
docker compose up --build            # http://localhost:3000

# Option B: no Docker
node scripts/dev-mongo.mjs &          # MongoDB replica set on :27017
cp .env.example apps/api/.env
npm run dev:api &                     # http://localhost:4000
npm run dev:web                       # http://localhost:3000
```

## Tests

```bash
npm test -w @wg/api      # slot engine + booking API, incl. a concurrent double-booking race
npm run typecheck
```

## Before launch: open items for Sabine

Search the code for `TODO(sabine)`:

- Official logo file (a placeholder wordmark is in `apps/web/src/components/Logo.tsx`)
- Real phone number (the current site shows a template placeholder)
- Every price: plans, other packages, care boxes (`apps/web/src/content/offerings.ts`); unknown prices show "Price coming soon"
- Care box contents
- Consented client testimonials (FTC 16 CFR Part 465); the testimonials page is intentionally empty and unindexed until then
- A real founder photo and short bio for the About page
- AHA CPR partner name and booking link
- Attorney-reviewed privacy policy and terms

CNA program: the site collects a free cohort list and does **not** take deposits while Georgia DCH approval is pending.

## Brand

Colors are sampled from the current site's Elementor globals: forest `#205044`, linen `#F4F1E9`, marigold `#FEC42D`. Type: Newsreader (headings) and Public Sans (text), 18px base for older readers.

Photography is real (Pexels license, credits in `apps/web/src/content/site.ts`). Self-host optimized copies before launch.
