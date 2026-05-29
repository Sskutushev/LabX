export type ContactPayload = {
  name: string;
  phone: string;
  email: string;
  comment: string;
  website?: string;
};

export type ValidationResult =
  | { ok: true; data: Omit<ContactPayload, "website"> }
  | { ok: false; errors: string[] };

const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const clean = (value: unknown) => String(value ?? "").trim();

export function validateContactPayload(payload: ContactPayload): ValidationResult {
  const errors: string[] = [];
  const name = clean(payload.name);
  const phone = clean(payload.phone);
  const email = clean(payload.email).toLowerCase();
  const comment = clean(payload.comment);
  const website = clean(payload.website);

  if (website) errors.push("Spam check failed");
  if (name.length < 2) errors.push("Имя должно содержать минимум 2 символа");
  if (name.length > 80) errors.push("Имя слишком длинное");
  if (!phoneRegex.test(phone)) errors.push("Телефон в некорректном формате");
  if (!emailRegex.test(email)) errors.push("Email в некорректном формате");
  if (comment.length < 10) errors.push("Комментарий должен содержать минимум 10 символов");
  if (comment.length > 3000) errors.push("Комментарий слишком длинный");

  if (errors.length) return { ok: false, errors };
  return { ok: true, data: { name, phone, email, comment } };
}

export function localSummary(input: string): string {
  const text = clean(input);
  if (!text) return "Добавьте текст, чтобы получить summary.";
  const normalized = text.replace(/\s+/g, " ");
  if (normalized.length <= 140) return `Коротко: ${normalized}`;
  return `Коротко: ${normalized.slice(0, 137)}...`;
}
