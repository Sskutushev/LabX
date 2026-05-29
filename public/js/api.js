async function parseJson(response) {
    const body = (await response.json());
    if (!response.ok)
        throw body;
    return body;
}
export async function postContact(payload) {
    const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
    return parseJson(response);
}
export async function postAiSummary(text) {
    const response = await fetch("/api/ai-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
    });
    return parseJson(response);
}
