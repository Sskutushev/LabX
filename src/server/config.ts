import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3000),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  OWNER_EMAIL: z.string().email(),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().int().positive().default(587),
  SMTP_SECURE: z
    .string()
    .optional()
    .transform((v) => v === "true"),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().optional(),
  TELEGRAM_BOT_TOKEN: z.string().optional(),
  TELEGRAM_CHAT_ID: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_MODEL: z.string().default("gpt-4o-mini"),
  CONTACT_RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60000),
  CONTACT_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(8),
  REDIS_URL: z.string().optional(),
  CORS_ORIGIN: z.string().default("*")
});

export type AppConfig = {
  app: { port: number; nodeEnv: "development" | "test" | "production" };
  ownerEmail: string;
  smtp: { host?: string; port: number; secure: boolean; user?: string; pass?: string; from?: string };
  telegram: { botToken?: string; chatId?: string };
  openai: { apiKey?: string; model: string };
  contact: { rateLimitWindowMs: number; rateLimitMax: number };
  redisUrl?: string;
  corsOrigin: string;
};

export function getConfig(env: NodeJS.ProcessEnv): AppConfig {
  const parsed = envSchema.safeParse(env);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
    throw new Error(`Invalid environment: ${issues}`);
  }

  const e = parsed.data;
  return {
    app: { port: e.PORT, nodeEnv: e.NODE_ENV },
    ownerEmail: e.OWNER_EMAIL,
    smtp: {
      host: e.SMTP_HOST,
      port: e.SMTP_PORT,
      secure: e.SMTP_SECURE ?? false,
      user: e.SMTP_USER,
      pass: e.SMTP_PASS,
      from: e.SMTP_FROM
    },
    telegram: { botToken: e.TELEGRAM_BOT_TOKEN, chatId: e.TELEGRAM_CHAT_ID },
    openai: { apiKey: e.OPENAI_API_KEY, model: e.OPENAI_MODEL },
    contact: { rateLimitWindowMs: e.CONTACT_RATE_LIMIT_WINDOW_MS, rateLimitMax: e.CONTACT_RATE_LIMIT_MAX },
    redisUrl: e.REDIS_URL,
    corsOrigin: e.CORS_ORIGIN
  };
}
