type Dict = Record<string, string>;

const dict: Record<"ru" | "en", Dict> = {
  ru: {
    "nav.about": "Обо мне",
    "nav.workflow": "Как работаю",
    "nav.cases": "Кейсы",
    "nav.contact": "Контакты",
    "hero.kicker": "Fullstack Developer (React / TypeScript / Node.js)",
    "hero.title": "Строю продуктовые интерфейсы для высоких нагрузок и роста бизнеса",
    "hero.subtitle":
      "Веду фичи end-to-end: от архитектуры и API до релиза, аналитики и поддержки пользователей.",
    "about.title": "Обо мне",
    "about.stackTitle": "Стек",
    "about.stackText":
      "React, TypeScript (strict), Next.js, Node.js, PostgreSQL, Redis, BigQuery, Docker.",
    "about.expTitle": "Опыт",
    "about.expText":
      "Коммерческая разработка frontend/fullstack, high-load сценарии, интеграции и поддержка production.",
    "about.dirTitle": "Направления",
    "about.dirText":
      "Производительность UI, API-интеграции, надежная логика форм, AI-автоматизация.",
    "workflow.title": "Как я работаю",
    "workflow.approachTitle": "Подход к задачам",
    "workflow.approachText":
      "Декомпозиция, API-контракт, MVP, edge-cases, тесты и пошаговые улучшения через PR.",
    "workflow.aiTitle": "AI в процессе",
    "workflow.aiText":
      "Использую AI как ускоритель: черновики, генерация тест-кейсов, рефакторинг идей и техническая документация.",
    "cases.title": "Кейсы",
    "cases.note": "Более подробно можно ознакомиться на реальном сайте портфолио:",
    "contact.title": "Контакты",
    "contact.copy": "Скопировать email",
    "form.name": "Имя",
    "form.phone": "Телефон",
    "form.email": "Email",
    "form.comment": "Комментарий",
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
    "nav.about": "About",
    "nav.workflow": "Workflow",
    "nav.cases": "Cases",
    "nav.contact": "Contacts",
    "hero.kicker": "Fullstack Developer (React / TypeScript / Node.js)",
    "hero.title": "I build product interfaces for high-load growth",
    "hero.subtitle":
      "I deliver end-to-end features from architecture and API to release, analytics and support.",
    "about.title": "About",
    "about.stackTitle": "Stack",
    "about.stackText":
      "React, TypeScript (strict), Next.js, Node.js, PostgreSQL, Redis, BigQuery, Docker.",
    "about.expTitle": "Experience",
    "about.expText":
      "Commercial frontend/fullstack development, high-load scenarios, integrations and production support.",
    "about.dirTitle": "Focus",
    "about.dirText": "UI performance, API integrations, reliable form logic, AI automation.",
    "workflow.title": "How I work",
    "workflow.approachTitle": "Approach",
    "workflow.approachText":
      "Decomposition, API contract, MVP, edge-cases, tests, and iterative PR-driven delivery.",
    "workflow.aiTitle": "AI in workflow",
    "workflow.aiText":
      "I use AI as an accelerator: drafts, test-case generation, refactoring options, and technical docs.",
    "cases.title": "Cases",
    "cases.note": "More details are available on the live portfolio website:",
    "contact.title": "Contacts",
    "contact.copy": "Copy email",
    "form.name": "Name",
    "form.phone": "Phone",
    "form.email": "Email",
    "form.comment": "Comment",
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

  function t(key: string) {
    return dict[lang][key] ?? dict.ru[key] ?? key;
  }

  function apply() {
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach((node) => {
      const key = node.getAttribute("data-i18n");
      if (!key) return;
      node.textContent = t(key);
    });
  }

  return {
    t,
    apply,
    getLang: () => lang,
    setLang: (value: "ru" | "en") => {
      lang = value;
      localStorage.setItem("lang", value);
      apply();
    }
  };
}
