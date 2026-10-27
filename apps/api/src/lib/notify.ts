import { logger } from "./logger.js";

/**
 * Outbound notification port. Phase 1 logs only (no PII);
 * Phase 2 adapters: Postmark (email, from a verified wellguardians.com domain
 * with SPF/DKIM/DMARC) and Twilio (SMS, A2P 10DLC registered).
 * Swap implementations via setNotifier() at boot.
 */
export type NotificationEvent =
  | { kind: "booking.confirmed"; bookingId: string; reference: string; manageToken: string }
  | { kind: "booking.cancelled"; bookingId: string; reference: string }
  | { kind: "lead.created"; leadId: string; leadKind: string };

export interface Notifier {
  send(event: NotificationEvent): Promise<void>;
}

let current: Notifier = {
  async send(event) {
    const { kind } = event;
    logger.info({ kind, ref: "reference" in event ? event.reference : undefined }, "notification queued (dev log notifier)");
  },
};

export const setNotifier = (n: Notifier) => (current = n);
/** Fire-and-forget; a failing provider must never fail the user's request. */
export const notify = (e: NotificationEvent) =>
  current.send(e).catch((err) => logger.error({ err, kind: e.kind }, "notification failed"));
