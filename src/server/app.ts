import express, { type Request, type Response, type NextFunction } from "express";
import path from "node:path";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { RedisStore, type RedisReply } from "rate-limit-redis";
import Redis from "ioredis";
import pinoHttp from "pino-http";
import { getConfig, type AppConfig } from "./config";
import { logger } from "./logger";
import { validateContactPayload } from "./validation";
import { processContact } from "./services/contact.service";
import { createSummary } from "./services/ai.service";

function requestId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function createContactLimiter(config: AppConfig) {
  if (config.redisUrl) {
    const redis = new Redis(config.redisUrl);
    return rateLimit({
      windowMs: config.contact.rateLimitWindowMs,
      limit: config.contact.rateLimitMax,
      standardHeaders: true,
      legacyHeaders: false,
      store: new RedisStore({
        sendCommand: (...args: string[]) =>
          redis.call(args[0], ...args.slice(1)) as Promise<RedisReply>
      })
    });
  }

  return rateLimit({
    windowMs: config.contact.rateLimitWindowMs,
    limit: config.contact.rateLimitMax,
    standardHeaders: true,
    legacyHeaders: false
  });
}

export function createApp(override?: AppConfig) {
  const config = override ?? getConfig(process.env);
  const app = express();

  app.disable("x-powered-by");
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(cors({ origin: config.corsOrigin === "*" ? true : config.corsOrigin }));
  app.use(express.json({ limit: "100kb" }));
  app.use(
    pinoHttp({
      logger,
      genReqId: (req, res) => {
        const id = requestId();
        res.setHeader("X-Request-Id", id);
        return id;
      }
    })
  );

  app.use(express.static(path.join(process.cwd(), "public")));

  app.post("/api/contact", createContactLimiter(config), async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validation = validateContactPayload(req.body);
      if (!validation.ok) return res.status(400).json({ ok: false, message: "Ошибка валидации", errors: validation.errors, requestId: req.id });

      const result = await processContact(config, validation.data);
      return res.json({ ok: true, message: "Форма успешно отправлена", ...result, requestId: req.id });
    } catch (error) {
      return next(error);
    }
  });

  app.post("/api/ai-summary", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const text = String(req.body?.text ?? "").trim();
      if (!text) return res.status(400).json({ ok: false, message: "Передайте текст для summary", requestId: req.id });
      const result = await createSummary(config, text);
      return res.json({ ok: true, ...result, requestId: req.id });
    } catch (error) {
      return next(error);
    }
  });

  app.get("/api/health", (_req, res) => res.json({ ok: true, status: "up", uptimeSec: Math.round(process.uptime()) }));

  app.use((req, res) => res.status(404).json({ ok: false, message: "Маршрут не найден", requestId: req.id }));
  app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
    req.log.error({ err }, "Unhandled error");
    res.status(500).json({ ok: false, message: "Внутренняя ошибка сервера", errors: [err.message], requestId: req.id });
  });

  return { app, config };
}
