function ok(res, payload, status = 200) {
  return res.status(status).json({ ok: true, ...payload });
}

function fail(res, payload, status = 400) {
  return res.status(status).json({ ok: false, ...payload });
}

module.exports = { ok, fail };
