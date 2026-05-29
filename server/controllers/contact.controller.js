const { validateContactPayload } = require("../validation");
const { processContactRequest } = require("../services/contact.service");
const { fail, ok } = require("../utils/http");

function createContactController(config) {
  return async function contactController(req, res, next) {
    try {
      const validation = validateContactPayload(req.body || {});
      if (!validation.isValid) {
        return fail(
          res,
          {
            message: "Ошибка валидации",
            errors: validation.errors,
            requestId: req.requestId
          },
          400
        );
      }

      const result = await processContactRequest(config, validation.data);
      return ok(res, {
        message: "Форма успешно отправлена",
        requestId: req.requestId,
        email: result.email,
        telegram: result.telegram,
        warning: result.warning
      });
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = { createContactController };
