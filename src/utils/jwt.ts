import jwt from "jsonwebtoken";
import "dotenv/config";
import { User } from "../../models";

const secret = process.env.JWT_SECRET || "";
const expiresIn = process.env.JWT_EXPIRES_IN;

export type UserType = Pick<User, "id" | "firstname"| "lastname"| "email" | "role">;

declare module "jsonwebtoken" {
  export interface JwtPayload {
    user?: UserType;
  }
}

const generateToken = (user: UserType) => {
  return jwt.sign({ user }, secret, { expiresIn });
};

const verifyToken = (token: string) => {
  return <jwt.JwtPayload>jwt.verify(token, secret);
};

export { generateToken, verifyToken };
