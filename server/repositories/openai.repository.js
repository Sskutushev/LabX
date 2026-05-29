async function generateOpenAiSummary(config, text) {
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.openai.apiKey}`
    },
    body: JSON.stringify({
      model: config.openai.model,
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
    throw new Error(`OpenAI request failed with status ${response.status}`);
  }

  const payload = await response.json();
  return payload.output_text ? payload.output_text.trim() : "";
}

module.exports = { generateOpenAiSummary };
