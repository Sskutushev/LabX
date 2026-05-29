type ApiError = { errors?: string[]; requestId?: string };

async function parseJson<T>(response: Response): Promise<T> {
  const body = (await response.json()) as T & ApiError;
  if (!response.ok) throw body;
  return body;
}

export async function postContact(payload: Record<string, string>) {
  const response = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  return parseJson(response);
}

export async function postAiSummary(text: string) {
  const response = await fetch("/api/ai-summary", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text })
  });
  return parseJson<{ summary: string; mode: string }>(response);
}
