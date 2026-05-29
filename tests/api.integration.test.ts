import test from "node:test";
import assert from "node:assert/strict";
import { createApp } from "../src/server/app";
import type { AppConfig } from "../src/server/config";

const testConfig: AppConfig = {
  app: { port: 0, nodeEnv: "test" },
  ownerEmail: "owner@example.com",
  smtp: { secure: false, port: 587 },
  telegram: {},
  openai: { model: "gpt-4o-mini" },
  contact: { rateLimitWindowMs: 60000, rateLimitMax: 1 },
  corsOrigin: "*"
};

test("contact endpoint success and rate limit", async () => {
  const { app } = createApp(testConfig);
  const server = app.listen(0);
  await new Promise((r) => server.once("listening", r));
  const port = (server.address() as { port: number }).port;

  const payload = {
    name: "Sergey",
    phone: "+7 999 111 22 33",
    email: "test@example.com",
    comment: "Проверка рабочей формы с mock SMTP"
  };

  const first = await fetch(`http://127.0.0.1:${port}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  assert.equal(first.status, 200);

  const second = await fetch(`http://127.0.0.1:${port}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  assert.equal(second.status, 429);

  await new Promise((r, j) => server.close((e) => (e ? j(e) : r(undefined))));
});
