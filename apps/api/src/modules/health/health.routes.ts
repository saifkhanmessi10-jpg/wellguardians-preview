import { Router } from "express";
import mongoose from "mongoose";

export const healthRouter = Router();
healthRouter.get("/healthz", (_req, res) => res.json({ ok: true }));
healthRouter.get("/readyz", (_req, res) => {
  const ready = mongoose.connection.readyState === 1;
  res.status(ready ? 200 : 503).json({ ok: ready });
});
