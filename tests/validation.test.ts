import test from "node:test";
import assert from "node:assert/strict";
import { validateContactPayload, localSummary } from "../src/server/validation";

test("validateContactPayload accepts valid payload", () => {
  const result = validateContactPayload({
    name: "Sergey",
    phone: "+7 (999) 123-45-67",
    email: "test@example.com",
    comment: "Хочу обсудить разработку лендинга и API формы"
  });
  assert.equal(result.ok, true);
});

test("validateContactPayload rejects honeypot", () => {
  const result = validateContactPayload({
    name: "Sergey",
    phone: "+7 (999) 123-45-67",
    email: "test@example.com",
    comment: "Хочу обсудить разработку лендинга и API формы",
    website: "spam"
  });
  assert.equal(result.ok, false);
});

test("localSummary shortens long text", () => {
  const summary = localSummary("x".repeat(200));
  assert.ok(summary.endsWith("..."));
});
