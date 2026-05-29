type Dict = Record<string, string>;

const dict: Record<"ru" | "en", Dict> = {
  ru: {
    "form.submit": "Отправить",
    "status.sending": "Отправка...",
    "status.sent": "Успешно! Форма отправлена",
    "status.submitFailed": "Ошибка отправки",
    "status.aiNeedText": "Введите комментарий для AI summary",
    "status.aiGenerating": "Генерация...",
    "status.aiReady": "AI summary готово",
    "status.aiFailed": "Не удалось получить AI summary",
    "status.emailCopied": "Email скопирован",
    "status.emailCopyFailed": "Не удалось скопировать email"
  },
  en: {
    "form.submit": "Send",
    "status.sending": "Sending...",
    "status.sent": "Success! Form submitted",
    "status.submitFailed": "Submit failed",
    "status.aiNeedText": "Enter comment text for AI summary",
    "status.aiGenerating": "Generating...",
    "status.aiReady": "AI summary ready",
    "status.aiFailed": "Failed to generate AI summary",
    "status.emailCopied": "Email copied",
    "status.emailCopyFailed": "Failed to copy email"
  }
};

export function createI18n(initialLang: "ru" | "en") {
  let lang = initialLang;
  return {
    t: (key: string) => dict[lang][key] ?? dict.ru[key] ?? key,
    getLang: () => lang,
    setLang: (value: "ru" | "en") => {
      lang = value;
      localStorage.setItem("lang", value);
      document.documentElement.lang = value;
    }
  };
}
