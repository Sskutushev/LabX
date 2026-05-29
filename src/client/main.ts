import { createI18n } from "./i18n.js";
import { postAiSummary, postContact } from "./api.js";
import { cases } from "./content.js";

const form = document.getElementById("contact-form") as HTMLFormElement;
const statusNode = document.getElementById("form-status") as HTMLParagraphElement;
const submitBtn = document.getElementById("submit-btn") as HTMLButtonElement;
const aiBtn = document.getElementById("ai-btn") as HTMLButtonElement;
const copyEmailBtn = document.getElementById("copy-email") as HTMLButtonElement;
const emailLink = document.getElementById("email-link") as HTMLAnchorElement;
const langRuBtn = document.getElementById("lang-ru") as HTMLButtonElement;
const langEnBtn = document.getElementById("lang-en") as HTMLButtonElement;
const themeToggleBtn = document.getElementById("theme-toggle") as HTMLButtonElement;
const casesGrid = document.getElementById("cases-grid") as HTMLDivElement;

const i18n = createI18n((localStorage.getItem("lang") as "ru" | "en") || "ru");

function setStatus(message: string, type = "") {
  statusNode.textContent = message;
  statusNode.className = `status ${type}`.trim();
}

function renderCases() {
  const lang = i18n.getLang();
  casesGrid.innerHTML = "";
  for (const item of cases) {
    const article = document.createElement("article");
    article.className = "card";
    article.innerHTML = `<h3>${item.title[lang]}</h3><p>${item.text[lang]}</p>`;
    casesGrid.append(article);
  }
}

function setTheme() {
  const current = localStorage.getItem("theme") || "dark";
  document.documentElement.setAttribute("data-theme", current);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
  localStorage.setItem("theme", current);
  document.documentElement.setAttribute("data-theme", current);
}

function readForm() {
  const data = new FormData(form);
  return {
    name: String(data.get("name") || "").trim(),
    phone: String(data.get("phone") || "").trim(),
    email: String(data.get("email") || "").trim(),
    comment: String(data.get("comment") || "").trim(),
    website: String(data.get("website") || "").trim()
  };
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  submitBtn.disabled = true;
  submitBtn.textContent = i18n.t("status.sending");
  setStatus("");
  try {
    const result = (await postContact(readForm())) as { warning?: string };
    setStatus(`${i18n.t("status.sent")}${result.warning ? ` (${result.warning})` : ""}`, "success");
    form.reset();
  } catch (error) {
    const e = error as { errors?: string[]; requestId?: string };
    setStatus(
      `${i18n.t("status.submitFailed")}: ${(e.errors || []).join("; ")} ${e.requestId || ""}`,
      "error"
    );
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = i18n.t("form.submit");
  }
});

aiBtn.addEventListener("click", async () => {
  const commentInput = form.querySelector("textarea[name='comment']") as HTMLTextAreaElement;
  const text = commentInput.value.trim();
  if (!text) return setStatus(i18n.t("status.aiNeedText"), "error");
  aiBtn.disabled = true;
  aiBtn.textContent = i18n.t("status.aiGenerating");
  try {
    const data = await postAiSummary(text);
    commentInput.value = data.summary;
    setStatus(`${i18n.t("status.aiReady")} (${data.mode})`, "success");
  } catch {
    setStatus(i18n.t("status.aiFailed"), "error");
  } finally {
    aiBtn.disabled = false;
    aiBtn.textContent = "AI summary";
  }
});

copyEmailBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(emailLink.textContent || "");
    setStatus(i18n.t("status.emailCopied"), "success");
  } catch {
    setStatus(i18n.t("status.emailCopyFailed"), "error");
  }
});

langRuBtn.addEventListener("click", () => {
  i18n.setLang("ru");
  submitBtn.textContent = i18n.t("form.submit");
  renderCases();
});
langEnBtn.addEventListener("click", () => {
  i18n.setLang("en");
  submitBtn.textContent = i18n.t("form.submit");
  renderCases();
});
themeToggleBtn.addEventListener("click", toggleTheme);

setTheme();
submitBtn.textContent = i18n.t("form.submit");
renderCases();
