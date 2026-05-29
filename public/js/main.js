import { createI18n } from "./i18n.js";
import { createTheme } from "./theme.js";
import { createStatusUi, bindRevealAnimations } from "./ui.js";
import { createFormController } from "./form-controller.js";

const form = document.getElementById("contact-form");
const statusNode = document.getElementById("form-status");
const submitBtn = document.getElementById("submit-btn");
const aiBtn = document.getElementById("ai-btn");
const copyEmailBtn = document.getElementById("copy-email");
const emailLink = document.getElementById("email-link");
const langRuBtn = document.getElementById("lang-ru");
const langEnBtn = document.getElementById("lang-en");
const themeToggleBtn = document.getElementById("theme-toggle");

const i18n = createI18n(localStorage.getItem("lang") || "ru");
const theme = createTheme(localStorage.getItem("theme") || "dark");
const statusUi = createStatusUi(statusNode);

const formController = createFormController({
  form,
  submitBtn,
  aiBtn,
  statusUi,
  i18n
});

async function onCopyEmail() {
  const email = emailLink.textContent.trim();

  try {
    await navigator.clipboard.writeText(email);
    statusUi.set(i18n.t("status.emailCopied"), "success");
  } catch (_error) {
    statusUi.set(i18n.t("status.emailCopyFailed"), "error");
  }
}

function bindLanguageControls() {
  langRuBtn.addEventListener("click", () => {
    i18n.setLang("ru");
    submitBtn.textContent = i18n.t("form.submit");
  });

  langEnBtn.addEventListener("click", () => {
    i18n.setLang("en");
    submitBtn.textContent = i18n.t("form.submit");
  });
}

function bootstrap() {
  theme.apply();
  i18n.apply();
  formController.bind();
  bindLanguageControls();
  themeToggleBtn.addEventListener("click", theme.toggle);
  copyEmailBtn.addEventListener("click", onCopyEmail);
  bindRevealAnimations();
}

bootstrap();
