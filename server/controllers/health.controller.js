const { ok } = require("../utils/http");

function healthController(_req, res) {
  return ok(res, { status: "up", uptimeSec: Math.round(process.uptime()) });
}

module.exports = { healthController };
