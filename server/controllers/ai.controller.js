const { createSummary } = require("../services/ai.service");
const { fail, ok } = require("../utils/http");

function createAiController(config) {
  return async function aiController(req, res, next) {
    try {
      const text = String((req.body || {}).text || "").trim();
      if (!text) {
        return fail(res, { message: "Передайте текст для summary", requestId: req.requestId }, 400);
      }

      const result = await createSummary(config, text);
      return ok(res, result);
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = { createAiController };
