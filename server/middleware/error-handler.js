const { fail } = require("../utils/http");

function notFoundHandler(req, res) {
  return fail(res, { message: "Маршрут не найден", requestId: req.requestId }, 404);
}

function errorHandler(err, req, res, _next) {
  return fail(
    res,
    {
      message: "Внутренняя ошибка сервера",
      errors: [err.message],
      requestId: req.requestId
    },
    500
  );
}

module.exports = { notFoundHandler, errorHandler };
