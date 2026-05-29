async function notifyTelegram(data) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return { sent: false, reason: "telegram_not_configured" };
  }

  const text = [
    "Новая заявка с сайта",
    `Имя: ${data.name}`,
    `Телефон: ${data.phone}`,
    `Email: ${data.email}`,
    `Комментарий: ${data.comment}`
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

module.exports = { notifyTelegram };
