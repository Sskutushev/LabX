const express = require("express");
const { createContactController } = require("../controllers/contact.controller");
const { createAiController } = require("../controllers/ai.controller");
const { healthController } = require("../controllers/health.controller");
const { createMemoryRateLimiter } = require("../middleware/rate-limit");

function createApiRouter(config) {
  const router = express.Router();

  const contactLimiter = createMemoryRateLimiter({
    windowMs: config.contact.rateLimitWindowMs,
    max: config.contact.rateLimitMax,
    keyResolver: (req) => req.ip || "unknown"
  });

  router.post("/contact", contactLimiter, createContactController(config));
  router.post("/ai-summary", createAiController(config));
  router.get("/health", healthController);

  return router;
}

module.exports = { createApiRouter };
