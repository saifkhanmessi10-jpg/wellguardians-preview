import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { DateTime } from "luxon";
import { createApp } from "../../app.js";

let mongo: MongoMemoryServer;
const app = createApp();

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
  await Promise.all(Object.values(mongoose.models).map((m) => m.syncIndexes()));
});
afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

const body = (start: string) => ({
  type: "consultation",
  topic: "aging_parent",
  start,
  mode: "video",
  contact: { firstName: "Denise", lastName: "Carter", email: "denise@example.com", phone: "404-555-0134" },
  acceptedDisclaimer: true,
});

async function firstSlot() {
  const from = DateTime.now().setZone("America/New_York").plus({ days: 3 }).toISODate();
  const res = await request(app).get(`/v1/availability?type=consultation&from=${from}&days=7`).expect(200);
  const slot = res.body.days.flatMap((d: { slots: { start: string }[] }) => d.slots)[0];
  expect(slot).toBeTruthy();
  return slot.start as string;
}

describe("booking API", () => {
  it("rejects invalid payloads with field errors", async () => {
    const res = await request(app).post("/v1/bookings").send({ type: "consultation" }).expect(400);
    expect(res.body.error.code).toBe("validation_error");
    expect(res.body.error.fields).toHaveProperty("contact");
  });

  it("books a slot, removes it from availability and returns an .ics", async () => {
    const start = await firstSlot();
    const res = await request(app).post("/v1/bookings").send(body(start)).expect(201);
    expect(res.body.reference).toMatch(/^WG-/);
    const again = await firstSlot();
    expect(again).not.toBe(start);
    const ics = await request(app).get(`/v1/bookings/manage/${res.body.manageToken}/calendar.ics`).expect(200);
    expect(ics.text).toContain("BEGIN:VEVENT");
  });

  it("never double-books under concurrent requests", async () => {
    const start = await firstSlot();
    const results = await Promise.all(
      Array.from({ length: 8 }, () => request(app).post("/v1/bookings").send(body(start))),
    );
    expect(results.filter((r) => r.status === 201)).toHaveLength(1);
    expect(results.filter((r) => r.status === 409).length).toBe(7);
  });

  it("frees the slot on cancellation", async () => {
    const start = await firstSlot();
    const res = await request(app).post("/v1/bookings").send(body(start)).expect(201);
    await request(app).post(`/v1/bookings/manage/${res.body.manageToken}/cancel`).expect(200);
    expect(await firstSlot()).toBe(start);
  });
});
