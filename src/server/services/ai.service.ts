import type { AppConfig } from "../config";
import { localSummary } from "../validation";

export async function createSummary(config: AppConfig, text: string): Promise<{ summary: string; mode: string }> {
  if (!config.openai.apiKey) return { summary: localSummary(text), mode: "local_fallback" };

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.openai.apiKey}`
      },
      body: JSON.stringify({
        model: config.openai.model,
        input: [
          { role: "system", content: "Сделай короткое summary текста в 1-2 предложениях." },
          { role: "user", content: text }
        ]
      })
    });

    if (!response.ok) return { summary: localSummary(text), mode: "api_failed_fallback" };
    const payload = (await response.json()) as { output_text?: string };
    return { summary: payload.output_text?.trim() || localSummary(text), mode: "openai" };
  } catch {
    return { summary: localSummary(text), mode: "api_exception_fallback" };
  }
}
