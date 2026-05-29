function createRequestId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function requestIdMiddleware(req, res, next) {
  const requestId = createRequestId();
  req.requestId = requestId;
  res.setHeader("X-Request-Id", requestId);
  next();
}

module.exports = { requestIdMiddleware };
