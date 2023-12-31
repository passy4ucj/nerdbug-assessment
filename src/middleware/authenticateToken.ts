import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { verifyToken } from "../utils";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Authorization header missing" });
  }

  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "No token provided" });
  }

  try {
        const decodedToken = verifyToken(token);
        req.user = decodedToken.user;
        next();

  } catch (error) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Invalid token" });
  }
};
