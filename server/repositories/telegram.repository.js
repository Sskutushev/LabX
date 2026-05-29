async function sendTelegramNotification(config, payload) {
  const token = config.telegram.botToken;
  const chatId = config.telegram.chatId;

  if (!token || !chatId) {
    return { sent: false, reason: "telegram_not_configured" };
  }

  const text = [
    "Новая заявка с сайта",
    `Имя: ${payload.name}`,
    `Телефон: ${payload.phone}`,
    `Email: ${payload.email}`,
    `Комментарий: ${payload.comment}`
  ].join("\n");

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text })
  });

  if (!response.ok) {
    return { sent: false, reason: "telegram_send_failed" };
  }

  return { sent: true };
}

module.exports = { sendTelegramNotification };
