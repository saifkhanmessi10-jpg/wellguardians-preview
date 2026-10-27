import { Schema, model } from "mongoose";
import { LEAD_KINDS } from "@wg/shared";

/** Flexible lead record; `data` holds the kind-specific validated payload. */
const leadSchema = new Schema(
  {
    kind: { type: String, enum: LEAD_KINDS, required: true, index: true },
    email: { type: String, required: true, index: true },
    status: { type: String, enum: ["new", "contacted", "qualified", "won", "lost", "archived"], default: "new", index: true },
    data: { type: Schema.Types.Mixed, required: true },
    source: String,
  },
  { timestamps: true },
);
leadSchema.index({ createdAt: -1 });
// Newsletter / waitlist signups are idempotent per list.
leadSchema.index(
  { kind: 1, email: 1, "data.list": 1 },
  { unique: true, partialFilterExpression: { kind: { $in: ["newsletter", "waitlist"] } } },
);

export const Lead = model("Lead", leadSchema);
