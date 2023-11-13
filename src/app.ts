require("dotenv").config();

import "express-async-errors";

// initialize the express app
import express, { Application, NextFunction, Request, Response } from "express";
const app: Application = express();

// security middleware
import cors from "cors";
const xssClean = require("xss-clean");

// application middleware
import { applicationRoutes } from "./routers";
import { StatusCodes } from "http-status-codes";
import Logger from "./logger";
import path from "path";
import { errorHandlerMiddleware, notFound } from "./middleware";

// use security middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [
      process.env.FRONTEND_BASE_URL!,
      process.env.APP_FRONTEND_BASE_URL!,
      "http://localhost:3000",
    ],
    credentials: true,
  })
);

app.use(xssClean());

// endpoint url logs
app.use(function (req: Request, _: Response, next: NextFunction) {
  const requestMethod = req.method;
  const fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
  Logger.info(`[ ${requestMethod} ] ${fullUrl}`);
  next();
});


app.use(express.static(path.join(__dirname, '/../src/public/')))

const apiPath = "/api/v1";

// home route
app.get(apiPath, (_: Request, res: Response) => {
  return res
    .status(StatusCodes.OK)
    .json({ message: "Welcome to NERDBUG-SERVICE" });
});

app.get(`${apiPath}/auth/error`, (_: Request, res: Response) => {
  return res.send("Authentication failed");
});

app.use(apiPath, applicationRoutes);

// Define a health check endpoint
app.get('/health', (_: Request, res: Response) => {
  return res
  .status(StatusCodes.OK)
  .json({ status: "healthy" });
});

// error handler middleware
app.use(errorHandlerMiddleware);

// not found middleware
app.use(notFound);

export default app;
