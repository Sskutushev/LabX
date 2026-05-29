function cleanText(value) {
  return String(value || "").trim();
}

function validateContactPayload(payload) {
  const errors = [];

  const name = cleanText(payload.name);
  const phone = cleanText(payload.phone);
  const email = cleanText(payload.email).toLowerCase();
  const comment = cleanText(payload.comment);

  if (!name || name.length < 2) {
    errors.push("Имя должно содержать минимум 2 символа");
  }

  if (!/^\+?[0-9\s\-()]{7,20}$/.test(phone)) {
    errors.push("Телефон в некорректном формате");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("Email в некорректном формате");
  }

  if (!comment || comment.length < 10) {
    errors.push("Комментарий должен содержать минимум 10 символов");
  }

  return {
    isValid: errors.length === 0,
    errors,
    data: { name, phone, email, comment }
  };
}

function localSummary(input) {
  const text = cleanText(input);
  if (!text) return "Добавьте текст, чтобы получить summary.";

  const normalized = text.replace(/\s+/g, " ");
  if (normalized.length <= 140) {
    return `Коротко: ${normalized}`;
  }

  return `Коротко: ${normalized.slice(0, 137)}...`;
}

module.exports = {
  validateContactPayload,
  localSummary
};
