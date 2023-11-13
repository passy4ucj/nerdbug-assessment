import { StatusCodes } from "http-status-codes";
import { CustomError } from "./CustomError";

export class ForbiddenError extends CustomError {
  statusCode = StatusCodes.FORBIDDEN;

  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
