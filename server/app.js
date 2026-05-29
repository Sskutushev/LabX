const path = require("path");
const express = require("express");
const { getConfig } = require("./config/env");
const { requestIdMiddleware } = require("./middleware/request-id");
const { notFoundHandler, errorHandler } = require("./middleware/error-handler");
const { createApiRouter } = require("./routes/api.routes");

function createApp(overrideConfig) {
  const config = overrideConfig || getConfig();
  const app = express();

  app.use(express.json());
  app.use(requestIdMiddleware);
  app.use(express.static(path.join(__dirname, "..", "public")));
  app.use("/api", createApiRouter(config));

  app.use(notFoundHandler);
  app.use(errorHandler);

  return { app, config };
}

module.exports = { createApp };
