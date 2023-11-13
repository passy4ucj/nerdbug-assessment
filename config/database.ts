import { Sequelize } from "sequelize-typescript";
import * as path from "path";
import "dotenv/config";
import { User } from "../models";

const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.ts")[env];

const sequelize = config.url
  ? new Sequelize(config.url, config)
  : new Sequelize({
      host: config.host,
      database: config.database,
      dialect: config.dialect,
      username: config.username,
      password: config.password,
      models: [path.join(__dirname, "src/models")],
      logging: env === "development" ? true : false,
      retry: {
        max: 5, // Maximum number of retries
        match: ["ETIMEDOUT", "EHOSTUNREACH", "ECONNRESET", "ECONNREFUSED"],
      },
    });

sequelize.addModels([User]);

export { Sequelize, sequelize };
