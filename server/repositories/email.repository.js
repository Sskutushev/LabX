const nodemailer = require("nodemailer");

function createTransport(config) {
  const hasSmtp = config.smtp.host && config.smtp.port && config.smtp.user && config.smtp.pass;

  if (!hasSmtp) {
    return {
      transport: nodemailer.createTransport({ jsonTransport: true }),
      mockMode: true
    };
  }

  return {
    transport: nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.secure,
      auth: {
        user: config.smtp.user,
        pass: config.smtp.pass
      }
    }),
    mockMode: false
  };
}

async function sendOwnerEmail(config, payload) {
  const { transport } = createTransport(config);
  return transport.sendMail({
    from: config.smtp.from || config.smtp.user || config.ownerEmail,
    to: config.ownerEmail,
    subject: `Новая заявка от ${payload.name}`,
    text: [
      "Новая заявка с сайта:",
      `Имя: ${payload.name}`,
      `Телефон: ${payload.phone}`,
      `Email: ${payload.email}`,
      `Комментарий: ${payload.comment}`
    ].join("\n")
  });
}

async function sendUserCopyEmail(config, payload) {
  const { transport } = createTransport(config);
  return transport.sendMail({
    from: config.smtp.from || config.smtp.user || config.ownerEmail,
    to: payload.email,
    subject: "Копия вашей заявки",
    text: [
      `Здравствуйте, ${payload.name}!`,
      "Мы получили вашу заявку.",
      "Детали:",
      `Телефон: ${payload.phone}`,
      `Комментарий: ${payload.comment}`
    ].join("\n")
  });
}

function isMockTransport(config) {
  return !Boolean(config.smtp.host && config.smtp.port && config.smtp.user && config.smtp.pass);
}

module.exports = {
  sendOwnerEmail,
  sendUserCopyEmail,
  isMockTransport
};
