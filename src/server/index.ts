import "dotenv/config";
import { createApp } from "./app";
import { logger } from "./logger";

const { app, config } = createApp();

app.listen(config.app.port, () => {
  logger.info(`Server is running on http://localhost:${config.app.port}`);
});
