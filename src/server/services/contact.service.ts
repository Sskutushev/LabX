import nodemailer from "nodemailer";
import type { AppConfig } from "../config";
import type { ContactPayload } from "../validation";

function createTransport(config: AppConfig) {
  const smtp = config.smtp;
  const configured = Boolean(smtp.host && smtp.user && smtp.pass);
  if (!configured) return { transport: nodemailer.createTransport({ jsonTransport: true }), mockMode: true };

  return {
    transport: nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.secure,
      auth: { user: smtp.user, pass: smtp.pass }
    }),
    mockMode: false
  };
}

async function notifyTelegram(config: AppConfig, data: Omit<ContactPayload, "website">) {
  const token = config.telegram.botToken;
  const chatId = config.telegram.chatId;
  if (!token || !chatId) return { sent: false, reason: "telegram_not_configured" };

  const text = ["Новая заявка", `Имя: ${data.name}`, `Телефон: ${data.phone}`, `Email: ${data.email}`, `Комментарий: ${data.comment}`].join("\n");
  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text })
  });
  return response.ok ? { sent: true } : { sent: false, reason: "telegram_send_failed" };
}

export async function processContact(config: AppConfig, data: Omit<ContactPayload, "website">) {
  const { transport, mockMode } = createTransport(config);
  const from = config.smtp.from || config.smtp.user || config.ownerEmail;

  const ownerInfo = await transport.sendMail({
    from,
    to: config.ownerEmail,
    subject: `Новая заявка от ${data.name}`,
    text: `Имя: ${data.name}\nТелефон: ${data.phone}\nEmail: ${data.email}\nКомментарий: ${data.comment}`
  });

  const userInfo = await transport.sendMail({
    from,
    to: data.email,
    subject: "Копия вашей заявки",
    text: `Здравствуйте, ${data.name}!\nМы получили вашу заявку.\nТелефон: ${data.phone}\nКомментарий: ${data.comment}`
  });

  const telegram = await notifyTelegram(config, data);

  return {
    email: { ownerMessageId: ownerInfo.messageId, userMessageId: userInfo.messageId, mockMode },
    telegram,
    warning: mockMode ? "SMTP не настроен: отправка выполнена в тестовом режиме" : null
  };
}
