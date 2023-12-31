import { StatusCodes } from "http-status-codes";
import { CustomError } from "./CustomError";

export class UnauthorizedError extends CustomError {
  statusCode = StatusCodes.UNAUTHORIZED;

  constructor() {
    super("Not Authorized");

    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
