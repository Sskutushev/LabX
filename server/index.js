require("dotenv").config();

const path = require("path");
const express = require("express");
const { validateContactPayload } = require("./validation");
const { sendContactEmails } = require("./mailer");
const { notifyTelegram } = require("./notify");
const { createSummary } = require("./ai");

const app = express();
const PORT = Number(process.env.PORT || 3000);
const contactHits = new Map();

function requestId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function contactRateLimit(req, res, next) {
  const key = req.ip || "unknown";
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxPerWindow = 8;
  const entry = contactHits.get(key) || [];
  const active = entry.filter((ts) => now - ts < windowMs);

  if (active.length >= maxPerWindow) {
    return res.status(429).json({
      ok: false,
      message: "Слишком много запросов. Попробуйте через минуту"
    });
  }

  active.push(now);
  contactHits.set(key, active);
  return next();
}

app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));
app.use((req, res, next) => {
  const id = requestId();
  req.requestId = id;
  res.setHeader("X-Request-Id", id);
  next();
});

app.post("/api/contact", contactRateLimit, async (req, res) => {
  const validation = validateContactPayload(req.body || {});
  if (!validation.isValid) {
    return res.status(400).json({
      ok: false,
      message: "Ошибка валидации",
      errors: validation.errors,
      requestId: req.requestId
    });
  }

  try {
    const emailResult = await sendContactEmails(validation.data);
    const telegramResult = await notifyTelegram(validation.data);

    return res.json({
      ok: true,
      message: "Форма успешно отправлена",
      email: emailResult,
      telegram: telegramResult,
      requestId: req.requestId,
      warning: emailResult.mockMode
        ? "SMTP не настроен: отправка выполнена в тестовом режиме"
        : null
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Не удалось отправить форму",
      errors: [error.message],
      requestId: req.requestId
    });
  }
});

app.post("/api/ai-summary", async (req, res) => {
  const text = String((req.body || {}).text || "").trim();
  if (!text) {
    return res.status(400).json({
      ok: false,
      message: "Передайте текст для summary"
    });
  }

  const result = await createSummary(text);
  return res.json({ ok: true, ...result });
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, status: "up", uptimeSec: Math.round(process.uptime()) });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
