const test = require("node:test");
const assert = require("node:assert/strict");
const { validateContactPayload, localSummary } = require("../server/validation");

test("validateContactPayload accepts valid payload", () => {
  const result = validateContactPayload({
    name: "Sergey",
    phone: "+7 (999) 123-45-67",
    email: "test@example.com",
    comment: "Хочу обсудить разработку лендинга и API формы"
  });

  assert.equal(result.isValid, true);
  assert.equal(result.errors.length, 0);
});

test("validateContactPayload returns errors for invalid payload", () => {
  const result = validateContactPayload({
    name: "A",
    phone: "123",
    email: "bad-email",
    comment: "short"
  });

  assert.equal(result.isValid, false);
  assert.equal(result.errors.length, 4);
});

test("localSummary trims and shortens long text", () => {
  const input = "x".repeat(180);
  const summary = localSummary(input);
  assert.ok(summary.startsWith("Коротко:"));
  assert.ok(summary.endsWith("..."));
});
