const { fail } = require("../utils/http");

function createMemoryRateLimiter({ windowMs, max, keyResolver }) {
  const hits = new Map();

  return function rateLimiter(req, res, next) {
    const now = Date.now();
    const key = keyResolver(req);
    const entry = hits.get(key) || [];
    const active = entry.filter((ts) => now - ts < windowMs);

    if (active.length >= max) {
      return fail(
        res,
        {
          message: "Слишком много запросов. Попробуйте через минуту",
          requestId: req.requestId
        },
        429
      );
    }

    active.push(now);
    hits.set(key, active);
    return next();
  };
}

module.exports = { createMemoryRateLimiter };
