import app from "./app";
import Logger from "./logger";
import { createServer } from "http";
const PORT = process.env.PORT || 3000;

import { sequelize } from "../config/database";

// start the express app
const start = async () => {
  try {

    const httpServer = createServer(app);

    await sequelize.authenticate();
    Logger.info(`Database Connected!`);
    httpServer.listen(PORT, async () => {
      Logger.info(`Server started on port ${PORT} 🔥🔥🔥`);
    });
  } catch (err) {
    Logger.error(err);
    process.exit(1);
  }
};

start();