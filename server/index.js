require("dotenv").config();

const path = require("path");
const express = require("express");
const { validateContactPayload } = require("./validation");
const { sendContactEmails } = require("./mailer");
const { notifyTelegram } = require("./notify");
const { createSummary } = require("./ai");

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

app.post("/api/contact", async (req, res) => {
  const validation = validateContactPayload(req.body || {});
  if (!validation.isValid) {
    return res.status(400).json({
      ok: false,
      message: "Ошибка валидации",
      errors: validation.errors
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
      warning: emailResult.mockMode
        ? "SMTP не настроен: отправка выполнена в тестовом режиме"
        : null
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Не удалось отправить форму",
      errors: [error.message]
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
  res.json({ ok: true, status: "up" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
