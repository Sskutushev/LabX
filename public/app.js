const form = document.getElementById("contact-form");
const statusNode = document.getElementById("form-status");
const submitBtn = document.getElementById("submit-btn");
const aiBtn = document.getElementById("ai-btn");
const copyEmailBtn = document.getElementById("copy-email");
const langRuBtn = document.getElementById("lang-ru");
const langEnBtn = document.getElementById("lang-en");
const themeToggleBtn = document.getElementById("theme-toggle");

const i18n = {
  ru: {
    "nav.about": "Обо мне",
    "nav.workflow": "Как работаю",
    "nav.cases": "Кейсы",
    "nav.contact": "Контакты",
    "hero.kicker": "Fullstack Developer (React / TypeScript / Node.js)",
    "hero.title": "Строю продуктовые интерфейсы для высоких нагрузок и роста бизнеса",
    "hero.subtitle": "11+ лет опыта. Веду фичи end-to-end: от архитектуры и API до релиза, аналитики и поддержки пользователей.",
    "about.title": "Обо мне",
    "about.stackTitle": "Стек",
    "about.stackText": "React, TypeScript (strict), Next.js, Node.js, PostgreSQL, Redis, BigQuery, Docker.",
    "about.expTitle": "Опыт",
    "about.expText": "11+ лет общего опыта, 3+ года в коммерческой разработке frontend/fullstack.",
    "about.dirTitle": "Направления",
    "about.dirText": "Производительность UI, API-интеграции, надежная логика форм, AI-автоматизация.",
    "workflow.title": "Как я работаю",
    "workflow.approachTitle": "Подход к задачам",
    "workflow.approachText": "Декомпозиция, API-контракт, MVP, edge-cases, тесты и пошаговые улучшения через PR.",
    "workflow.aiTitle": "AI в процессе",
    "workflow.aiText": "Использую AI как ускоритель: черновики, генерация тест-кейсов, рефакторинг идей и техническая документация.",
    "cases.title": "Кейсы",
    "cases.c1Title": "Лента объявлений 200k+",
    "cases.c1Text": "Снизил нагрузку браузера примерно на 75% через виртуализацию и оптимизацию состояния.",
    "cases.c2Title": "Pipeline поиска по фото",
    "cases.c2Text": "Реализовал full pipeline: parser -> Redis -> Wasabi -> embeddings -> Qdrant -> BigQuery.",
    "cases.c3Title": "E2E-платформа",
    "cases.c3Text": "Поднял Playwright-инфраструктуру с multi-server конфигом и API-auth под критичные сценарии.",
    "contact.title": "Контакты",
    "contact.copy": "Скопировать email",
    "form.name": "Имя",
    "form.phone": "Телефон",
    "form.email": "Email",
    "form.comment": "Комментарий",
    "form.submit": "Отправить"
  },
  en: {
    "nav.about": "About",
    "nav.workflow": "Workflow",
    "nav.cases": "Cases",
    "nav.contact": "Contacts",
    "hero.kicker": "Fullstack Developer (React / TypeScript / Node.js)",
    "hero.title": "I build product interfaces for high-load growth",
    "hero.subtitle": "11+ years of experience. I deliver end-to-end features from architecture and API to release, analytics and support.",
    "about.title": "About",
    "about.stackTitle": "Stack",
    "about.stackText": "React, TypeScript (strict), Next.js, Node.js, PostgreSQL, Redis, BigQuery, Docker.",
    "about.expTitle": "Experience",
    "about.expText": "11+ years overall experience, 3+ years in commercial frontend/fullstack development.",
    "about.dirTitle": "Focus",
    "about.dirText": "UI performance, API integrations, reliable form logic, AI automation.",
    "workflow.title": "How I work",
    "workflow.approachTitle": "Approach",
    "workflow.approachText": "Decomposition, API contract, MVP, edge-cases, tests, and iterative PR-driven delivery.",
    "workflow.aiTitle": "AI in workflow",
    "workflow.aiText": "I use AI as an accelerator: drafts, test-case generation, refactoring options, and technical docs.",
    "cases.title": "Cases",
    "cases.c1Title": "200k+ listing feed",
    "cases.c1Text": "Reduced browser load by ~75% using virtualization and state optimization.",
    "cases.c2Title": "Photo search pipeline",
    "cases.c2Text": "Built full pipeline: parser -> Redis -> Wasabi -> embeddings -> Qdrant -> BigQuery.",
    "cases.c3Title": "E2E platform",
    "cases.c3Text": "Set up Playwright infrastructure with multi-server config and API-auth for critical user flows.",
    "contact.title": "Contacts",
    "contact.copy": "Copy email",
    "form.name": "Name",
    "form.phone": "Phone",
    "form.email": "Email",
    "form.comment": "Comment",
    "form.submit": "Send"
  }
};

let currentLang = localStorage.getItem("lang") || "ru";
let currentTheme = localStorage.getItem("theme") || "dark";

function t(key) {
  return i18n[currentLang][key] || i18n.ru[key] || key;
}

function applyI18n() {
  document.documentElement.lang = currentLang;
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const key = node.getAttribute("data-i18n");
    node.textContent = t(key);
  });
}

function applyTheme() {
  document.documentElement.setAttribute("data-theme", currentTheme);
}

function setStatus(message, type = "") {
  statusNode.textContent = message;
  statusNode.className = `status ${type}`.trim();
}

function setLoading(isLoading) {
  submitBtn.disabled = isLoading;
  submitBtn.textContent = isLoading ? (currentLang === "ru" ? "Отправка..." : "Sending...") : t("form.submit");
}

function getFormData() {
  const data = new FormData(form);
  return {
    name: String(data.get("name") || "").trim(),
    phone: String(data.get("phone") || "").trim(),
    email: String(data.get("email") || "").trim(),
    comment: String(data.get("comment") || "").trim(),
    website: String(data.get("website") || "").trim()
  };
}

async function sendContact(payload) {
  const response = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const body = await response.json();
  if (!response.ok) throw body;
  return body;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  setStatus("");
  setLoading(true);

  try {
    const result = await sendContact(getFormData());
    const warning = result.warning ? ` (${result.warning})` : "";
    setStatus(currentLang === "ru" ? `Успешно! Форма отправлена${warning}` : `Success! Form submitted${warning}`, "success");
    form.reset();
  } catch (error) {
    const details = error.errors && error.errors.length ? `: ${error.errors.join("; ")}` : "";
    const rid = error.requestId ? ` (requestId: ${error.requestId})` : "";
    setStatus(currentLang === "ru" ? `Ошибка отправки${details}${rid}` : `Submit failed${details}${rid}`, "error");
  } finally {
    setLoading(false);
  }
});

aiBtn.addEventListener("click", async () => {
  const commentInput = form.querySelector("textarea[name='comment']");
  const text = commentInput.value.trim();

  if (!text) {
    setStatus(currentLang === "ru" ? "Введите комментарий для AI summary" : "Enter comment text for AI summary", "error");
    return;
  }

  aiBtn.disabled = true;
  const initialText = aiBtn.textContent;
  aiBtn.textContent = currentLang === "ru" ? "Генерация..." : "Generating...";

  try {
    const response = await fetch("/api/ai-summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });
    const body = await response.json();
    if (!response.ok) throw body;

    commentInput.value = body.summary;
    setStatus(currentLang === "ru" ? `AI summary готово (${body.mode})` : `AI summary ready (${body.mode})`, "success");
  } catch (_error) {
    setStatus(currentLang === "ru" ? "Не удалось получить AI summary" : "Failed to generate AI summary", "error");
  } finally {
    aiBtn.disabled = false;
    aiBtn.textContent = initialText;
  }
});

copyEmailBtn.addEventListener("click", async () => {
  const email = document.getElementById("email-link").textContent.trim();
  try {
    await navigator.clipboard.writeText(email);
    setStatus(currentLang === "ru" ? "Email скопирован" : "Email copied", "success");
  } catch (_error) {
    setStatus(currentLang === "ru" ? "Не удалось скопировать email" : "Failed to copy email", "error");
  }
});

langRuBtn.addEventListener("click", () => {
  currentLang = "ru";
  localStorage.setItem("lang", currentLang);
  applyI18n();
  setLoading(false);
});

langEnBtn.addEventListener("click", () => {
  currentLang = "en";
  localStorage.setItem("lang", currentLang);
  applyI18n();
  setLoading(false);
});

themeToggleBtn.addEventListener("click", () => {
  currentTheme = currentTheme === "dark" ? "light" : "dark";
  localStorage.setItem("theme", currentTheme);
  applyTheme();
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
applyTheme();
applyI18n();
