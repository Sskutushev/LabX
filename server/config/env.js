function env(name, fallback = "") {
  return String(process.env[name] ?? fallback).trim();
}

function toInt(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toBool(value, fallback = false) {
  if (!value) return fallback;
  return String(value).toLowerCase() === "true";
}

function getConfig() {
  return {
    app: {
      port: toInt(env("PORT", "3000"), 3000),
      nodeEnv: env("NODE_ENV", "development")
    },
    contact: {
      rateLimitWindowMs: toInt(env("CONTACT_RATE_LIMIT_WINDOW_MS", "60000"), 60000),
      rateLimitMax: toInt(env("CONTACT_RATE_LIMIT_MAX", "8"), 8)
    },
    ownerEmail: env("OWNER_EMAIL"),
    smtp: {
      host: env("SMTP_HOST"),
      port: toInt(env("SMTP_PORT", "587"), 587),
      secure: toBool(env("SMTP_SECURE"), false),
      user: env("SMTP_USER"),
      pass: env("SMTP_PASS"),
      from: env("SMTP_FROM")
    },
    telegram: {
      botToken: env("TELEGRAM_BOT_TOKEN"),
      chatId: env("TELEGRAM_CHAT_ID")
    },
    openai: {
      apiKey: env("OPENAI_API_KEY"),
      model: env("OPENAI_MODEL", "gpt-4o-mini")
    }
  };
}

module.exports = { getConfig };
