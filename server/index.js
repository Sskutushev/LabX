require("dotenv").config();

const { createApp } = require("./app");

const { app, config } = createApp();

app.listen(config.app.port, () => {
  console.log(`Server is running on http://localhost:${config.app.port}`);
});
