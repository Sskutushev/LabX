const {
  sendOwnerEmail,
  sendUserCopyEmail,
  isMockTransport
} = require("../repositories/email.repository");
const { sendTelegramNotification } = require("../repositories/telegram.repository");

async function processContactRequest(config, payload) {
  if (!config.ownerEmail) {
    throw new Error("OWNER_EMAIL is not configured");
  }

  const ownerInfo = await sendOwnerEmail(config, payload);
  const userInfo = await sendUserCopyEmail(config, payload);
  const telegram = await sendTelegramNotification(config, payload);

  return {
    email: {
      ownerMessageId: ownerInfo.messageId,
      userMessageId: userInfo.messageId,
      mockMode: isMockTransport(config)
    },
    telegram,
    warning: isMockTransport(config)
      ? "SMTP не настроен: отправка выполнена в тестовом режиме"
      : null
  };
}

module.exports = { processContactRequest };
