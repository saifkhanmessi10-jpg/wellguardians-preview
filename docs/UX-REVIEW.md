# UX review: Phase 1 public site

Reviewed against real screenshots at 1366px and 390px, and a scripted end-to-end run of booking and contact.

## Design critique

| # | Finding | Severity | Fix |
|---|---|---|---|
| 1 | The booking page and confirmation promise "cancel or reschedule from your confirmation email", but no page handles that link. | High (broken promise) | Built `/booking/[token]`: view, add to calendar, cancel, book a new time. |
| 2 | On phones the header's Book button is hidden; once a visitor scrolls past the hero there's no way to book without opening the menu. Most traffic will come from Instagram/Facebook on phones. | High | Sticky bottom bar on phones with "Book a free call", hidden on /book and on the manage page. |
| 3 | Hero buttons wrap onto two lines at desktop widths because the text column is narrow. | Medium | Rebalanced the hero grid. |
| 4 | Every price reads "Price coming soon". Visitors weighing cost before a call have nothing to anchor on. | Medium (content) | Needs Sabine's price sheet. Interim copy explains the call sets the plan. |
| 5 | No human face. Advocacy is trust-led and the site has no photo or words from Sabine. | Medium (content) | Needs a real photo and a short note from Sabine; slot reserved on About. |
| 6 | Testimonials are absent until consented ones arrive. | Low for now | Kept off the site by design. |
| 7 | Day and time pickers use `role="radio"` buttons without arrow-key movement. Tab still reaches every option. | Low | Phase 2: roving tabindex. |

What's working: the single focal moment (family photo + case-notes card), 18px base type, the forest/marigold palette from the existing brand, consistent action names ("Book a free consultation" everywhere), plain error copy, and no horizontal scroll at 390px on any page tested.

## Journey maps

### 1. Adult child caring for a parent (primary)
Instagram reel on phone → home → "Caring for an aging parent" → topic preselected in booking → time → details → confirmed → calendar file → (email, phase 2) → manage link.

| Stage | Before | After this pass |
|---|---|---|
| Lands on home from a reel | CTA lost after the hero on mobile | Sticky "Book a free call" bar |
| Needs to change the time | Dead end | Manage page: cancel and book a new time |

### 2. Someone fighting a bill
Search "medical bill advocate Georgia" → Insurance & Billing page → wants a price → none yet → books free call. Gap: prices (Sabine).

### 3. Clinic or agency manager
Organizations → two-step proposal → confirmation promising a reply within one business day. Works end to end. Phase 2: lead appears in the owner dashboard.

### 4. Aspiring CNA
Academy → CNA page (approval notice, 85-hour breakdown, standards) → joins the cohort list (free, no deposit). Works. Phase 5: enrollment once approved.

### 5. Gift buyer
Care packages → sees four boxes → "Notify me". Works as a waitlist until the store ships (phase 4).

## Not in scope yet
Owner dashboard, emails/SMS, client portal, store checkout, Academy portal, AI chat: see `ARCHITECTURE.md` roadmap.
