const test = require("node:test");
const assert = require("node:assert/strict");
const { createApp } = require("../server/app");

async function withServer(config, run) {
  const { app } = createApp(config);
  const server = app.listen(0);

  await new Promise((resolve) => server.once("listening", resolve));

  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}`;

  try {
    await run(baseUrl);
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
}

function getTestConfig(overrides = {}) {
  return {
    app: { port: 0, nodeEnv: "test" },
    contact: { rateLimitWindowMs: 60000, rateLimitMax: 8 },
    ownerEmail: "owner@example.com",
    smtp: {
      host: "",
      port: 587,
      secure: false,
      user: "",
      pass: "",
      from: ""
    },
    telegram: { botToken: "", chatId: "" },
    openai: { apiKey: "", model: "gpt-4o-mini" },
    ...overrides
  };
}

test("POST /api/contact returns success for valid payload", async () => {
  await withServer(getTestConfig(), async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Sergey",
        phone: "+7 999 111 22 33",
        email: "test@example.com",
        comment: "Проверка рабочей формы с mock SMTP"
      })
    });

    const body = await response.json();
    assert.equal(response.status, 200);
    assert.equal(body.ok, true);
    assert.equal(typeof body.requestId, "string");
    assert.equal(body.email.mockMode, true);
  });
});

test("POST /api/contact returns validation error", async () => {
  await withServer(getTestConfig(), async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "A",
        phone: "12",
        email: "wrong",
        comment: "few"
      })
    });

    const body = await response.json();
    assert.equal(response.status, 400);
    assert.equal(body.ok, false);
    assert.ok(Array.isArray(body.errors));
    assert.ok(body.errors.length >= 1);
  });
});

test("POST /api/contact rate limits repeated requests", async () => {
  await withServer(
    getTestConfig({ contact: { rateLimitWindowMs: 60000, rateLimitMax: 1 } }),
    async (baseUrl) => {
      const payload = {
        name: "Sergey",
        phone: "+7 999 111 22 33",
        email: "test@example.com",
        comment: "Проверка rate limit с валидным payload"
      };

      const first = await fetch(`${baseUrl}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      assert.equal(first.status, 200);

      const second = await fetch(`${baseUrl}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const body = await second.json();
      assert.equal(second.status, 429);
      assert.equal(body.ok, false);
    }
  );
});
