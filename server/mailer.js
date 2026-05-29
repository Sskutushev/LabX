const nodemailer = require("nodemailer");

function createTransport() {
  const hasSmtp =
    process.env.SMTP_HOST &&
    process.env.SMTP_PORT &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS;

  if (!hasSmtp) {
    return {
      transport: nodemailer.createTransport({ jsonTransport: true }),
      mockMode: true
    };
  }

  return {
    transport: nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: String(process.env.SMTP_SECURE) === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    }),
    mockMode: false
  };
}

async function sendContactEmails(data) {
  const ownerEmail = process.env.OWNER_EMAIL;
  if (!ownerEmail) {
    throw new Error("OWNER_EMAIL is not configured");
  }

  const { transport, mockMode } = createTransport();

  const ownerInfo = await transport.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER || ownerEmail,
    to: ownerEmail,
    subject: `Новая заявка от ${data.name}`,
    text: [
      "Новая заявка с сайта:",
      `Имя: ${data.name}`,
      `Телефон: ${data.phone}`,
      `Email: ${data.email}`,
      `Комментарий: ${data.comment}`
    ].join("\n")
  });

  const userInfo = await transport.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER || ownerEmail,
    to: data.email,
    subject: "Копия вашей заявки",
    text: [
      `Здравствуйте, ${data.name}!`,
      "Мы получили вашу заявку.",
      "Детали:",
      `Телефон: ${data.phone}`,
      `Комментарий: ${data.comment}`
    ].join("\n")
  });

  return {
    ownerMessageId: ownerInfo.messageId,
    userMessageId: userInfo.messageId,
    mockMode
  };
}

module.exports = {
  sendContactEmails
};
