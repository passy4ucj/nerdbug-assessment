import { createClient } from "redis";
import "dotenv/config";

import Logger from "../logger";

export const redisClient = createClient({ url: process.env.REDIS_URL });

redisClient.on("error", (error: Error) => {
  Logger.info(error);
});

redisClient.connect();
