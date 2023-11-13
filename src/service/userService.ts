import {
    User,
    UserCreationAttributes,
  } from "../../models/user.model";
  import bcrypt from "bcrypt";
  import { generateToken, redisClient, verifyToken } from "../utils";
  import { Response } from "express";
  import { StatusCodes } from "http-status-codes";
  
  const SALT_ROUND = 10;
  
export const findUserByEmailService = async (email: string) => {
    try {
      const user = await User.findOne({ where: { email } });
  
      return user;
    } catch (error) {
      throw error;
    }
};
  
export const createUserService = async (
    data: UserCreationAttributes
  ) => {
    const {
      firstname,
      lastname,
      password,
      role,
      email,
    } = data;
  
    try {
      const hashedPassword = await bcrypt.hash(password, SALT_ROUND);
  
      const user = await User.create({
        firstname,
        lastname,
        password: hashedPassword,
        role,
        email,
      });
  
      return {
        id: user.id,
        message: "User created successfully.",
      };
    } catch (error) {
      throw error;
    }
};
  
export const getUsersService = async () => {
    try {
      return await User.findAll({
        attributes: {
          exclude: ["password"],
        },
      });
    } catch (error) {
      throw error;
    }
};
  
export const getUserByIdService = async (id: string) => {
    try {
      const user = await User.findByPk(id, {
        attributes: {
          exclude: ["password"],
        },
      });
      return user;
    } catch (error) {
      throw error;
    }
};
  
export const updateUserService = async (
    id: string,
    data: Partial<UserCreationAttributes>
  ) => {
    try {
      await User.update(data, {
        where: { id },
      });
  
      return "User information updated successfully.";
    } catch (error) {
      throw error;
    }
};
  
export const deleteUserService = async (
    user: User
  ) => {
    try {
      await user.destroy();
  
      return "User deleted successfully.";
    } catch (error) {
      throw error;
    }
};
  
export const getUserPasswordById = async (id: string) => {
    return User.findByPk(id, {attributes: ["id", "password"]});
};


  
export const loginUserService = async (
    email: string,
    password: string
  ) => {
    try {
      const response = await User.findOne({
        where: { email },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });
  
      const user = response;
  
      if (!user) {
        throw new Error("User account with email not found.");
      }
  
      const isMatched = await bcrypt.compare(password, user.password);
  
      if (!isMatched) {
        throw new Error("Invalid credentials");
      }
  
      const userObj = {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
      };
  
      const token = generateToken(userObj);
  
      return token;
    } catch (error) {
      throw error;
    }
  };
  
  export const logoutUserService = async (token: string) => {
    try {
      const tokenExpireTime = verifyToken(token).exp;
      const currentTime = Math.floor(Date.now() / 1000);
      const ttl = (tokenExpireTime as number) - currentTime;
  
      await redisClient
        .multi()
        .sAdd("jwt-blacklisted-tokens", token)
        .expire("jwt-blacklisted-tokens", ttl)
        .exec();
  
      return "Logged out successfully";
    } catch (error) {
      throw error;
    }
  };
  