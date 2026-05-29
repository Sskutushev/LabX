const form = document.getElementById("contact-form");
const statusNode = document.getElementById("form-status");
const submitBtn = document.getElementById("submit-btn");
const aiBtn = document.getElementById("ai-btn");

function setStatus(message, type = "") {
  statusNode.textContent = message;
  statusNode.className = `status ${type}`.trim();
}

function setLoading(isLoading) {
  submitBtn.disabled = isLoading;
  submitBtn.textContent = isLoading ? "Отправка..." : "Отправить";
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
    setStatus(`Успешно! Форма отправлена${warning}`, "success");
    form.reset();
  } catch (error) {
    const details = error.errors && error.errors.length ? `: ${error.errors.join("; ")}` : "";
    const rid = error.requestId ? ` (requestId: ${error.requestId})` : "";
    setStatus(`Ошибка отправки${details}${rid}`, "error");
  } finally {
    setLoading(false);
  }
});

aiBtn.addEventListener("click", async () => {
  const commentInput = form.querySelector("textarea[name='comment']");
  const text = commentInput.value.trim();

  if (!text) {
    setStatus("Введите комментарий для AI summary", "error");
    return;
  }

  aiBtn.disabled = true;
  const initialText = aiBtn.textContent;
  aiBtn.textContent = "Генерация...";

  try {
    const response = await fetch("/api/ai-summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });
    const body = await response.json();
    if (!response.ok) throw body;

    commentInput.value = body.summary;
    setStatus(`AI summary готово (${body.mode})`, "success");
  } catch (_error) {
    setStatus("Не удалось получить AI summary", "error");
  } finally {
    aiBtn.disabled = false;
    aiBtn.textContent = initialText;
  }
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
