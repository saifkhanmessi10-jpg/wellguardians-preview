import { env } from "../../config/env.js";
import { Router } from "express";
import rateLimit from "express-rate-limit";
import { createLeadSchema } from "@wg/shared";
import { parse } from "../../lib/validate.js";
import { notify } from "../../lib/notify.js";
import { Lead } from "./lead.model.js";

export const leadRouter = Router();

leadRouter.post(
  "/leads",
  rateLimit({ windowMs: 15 * 60_000, limit: env.WRITE_RATE_LIMIT, standardHeaders: "draft-7", legacyHeaders: false }),
  async (req, res) => {
    const { website, source, email, kind, ...data } = parse(createLeadSchema, req.body);
    if (website) {
      res.status(202).json({ ok: true });
      return;
    }
    try {
      const lead = await Lead.create({ kind, email, source, data });
      notify({ kind: "lead.created", leadId: lead.id, leadKind: kind });
    } catch (err: unknown) {
      // Already subscribed — treat as success so we don't leak list membership.
      if ((err as { code?: number }).code !== 11000) throw err;
    }
    res.status(201).json({ ok: true });
  },
);
