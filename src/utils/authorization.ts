import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ForbiddenError } from "../errors";

export const isAdmin = (req: Request, _: Response, next: NextFunction) => {
    
  if (req.user?.role === 'admin') {
    next();
  } else {
    throw new ForbiddenError('Forbidden: user role not admin');
  }
};
