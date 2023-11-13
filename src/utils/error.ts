import { Request, Response } from "express";
import { ValidationError, validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";

type CustomValidationError = ValidationError & { path: string };

const errorFormatter = (error: CustomValidationError) =>
  `${error.path}: ${error.msg}`;

export const errorResponder = (req: Request, res: Response) => {
  const errors = validationResult(req).formatWith((error) =>
    errorFormatter(error as CustomValidationError)
  );

  if (!errors.isEmpty()) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: (errors.array() || [])[0] });
  }

  return true;
};
