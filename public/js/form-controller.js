import { postContact, postAiSummary } from "./api.js";

function readForm(form) {
  const data = new FormData(form);
  return {
    name: String(data.get("name") || "").trim(),
    phone: String(data.get("phone") || "").trim(),
    email: String(data.get("email") || "").trim(),
    comment: String(data.get("comment") || "").trim(),
    website: String(data.get("website") || "").trim()
  };
}

function setButtonLoading(button, loadingText, defaultText, isLoading) {
  button.disabled = isLoading;
  button.textContent = isLoading ? loadingText : defaultText;
}

export function createFormController({ form, submitBtn, aiBtn, statusUi, i18n }) {
  const commentInput = form.querySelector("textarea[name='comment']");

  async function onSubmit(event) {
    event.preventDefault();
    statusUi.set("");
    setButtonLoading(submitBtn, i18n.t("status.sending"), i18n.t("form.submit"), true);

    try {
      const result = await postContact(readForm(form));
      const warning = result.warning ? ` (${result.warning})` : "";
      statusUi.set(`${i18n.t("status.sent")}${warning}`, "success");
      form.reset();
    } catch (error) {
      const details = error.errors?.length ? `: ${error.errors.join("; ")}` : "";
      const rid = error.requestId ? ` (requestId: ${error.requestId})` : "";
      statusUi.set(`${i18n.t("status.submitFailed")}${details}${rid}`, "error");
    } finally {
      setButtonLoading(submitBtn, i18n.t("status.sending"), i18n.t("form.submit"), false);
    }
  }

  async function onAiSummary() {
    const text = commentInput.value.trim();
    if (!text) {
      statusUi.set(i18n.t("status.aiNeedText"), "error");
      return;
    }

    setButtonLoading(aiBtn, i18n.t("status.aiGenerating"), "AI summary", true);

    try {
      const result = await postAiSummary(text);
      commentInput.value = result.summary;
      statusUi.set(`${i18n.t("status.aiReady")} (${result.mode})`, "success");
    } catch (_error) {
      statusUi.set(i18n.t("status.aiFailed"), "error");
    } finally {
      setButtonLoading(aiBtn, i18n.t("status.aiGenerating"), "AI summary", false);
    }
  }

  function bind() {
    form.addEventListener("submit", onSubmit);
    aiBtn.addEventListener("click", onAiSummary);
  }

  return { bind };
}
