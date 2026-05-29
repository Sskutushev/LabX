const { localSummary } = require("./validation");

async function createSummary(text) {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  if (!apiKey) {
    return { summary: localSummary(text), mode: "local_fallback" };
  }

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        input: [
          {
            role: "system",
            content: "Ты помощник разработчика. Сделай короткое summary текста на русском в 1-2 предложениях."
          },
          {
            role: "user",
            content: String(text || "")
          }
        ]
      })
    });

    if (!response.ok) {
      return { summary: localSummary(text), mode: "api_failed_fallback" };
    }

    const payload = await response.json();
    const summary = payload.output_text ? payload.output_text.trim() : localSummary(text);
    return { summary, mode: "openai" };
  } catch (_error) {
    return { summary: localSummary(text), mode: "api_exception_fallback" };
  }
}

module.exports = { createSummary };
