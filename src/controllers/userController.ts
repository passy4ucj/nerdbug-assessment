import { Request, Response } from "express";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import { createUserService, deleteUserService, findUserByEmailService, getUserByIdService, getUserPasswordById, getUsersService, loginUserService, logoutUserService, updateUserService } from "../service";

const SALT_ROUND = 10;

export const createUser = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
  }

  try {
    const user = await findUserByEmailService(
      req.body.email
    );

    if (user) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "User with email already exists." });
    }

    const results = await createUserService(req.body);

    res.status(StatusCodes.CREATED).json(results);
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.BAD_REQUEST).json({ message: "Server Error" });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const results = await getUsersService();

    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.BAD_REQUEST).json({ message: "Server Error" });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await getUserByIdService(id);

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.BAD_REQUEST).json({ message: "Server Error" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
  }

  try {
    const user = await getUserByIdService(id);

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "User not found" });
    }

    const message = await updateUserService(
      user.id,
      req.body
    );

    res.json({ message });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.BAD_REQUEST).json({ message: "Server Error" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await getUserByIdService(id);

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "User not found" });
    }

    // Delete the user associate
    const message = await deleteUserService(user);

    res.json({ message });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.BAD_REQUEST).json({ message: "Server Error" });
  }
};

export const changeUserPassword = async (req: Request, res: Response) => {
  const { id } = req.params;

  const { currentPassword, password } = req.body;

  let success = false;
  let message = "";

  const user = await getUserPasswordById(id);

  if (!user) {
    message = "User not found";

    return res.status(StatusCodes.NOT_FOUND).json({ success, message });
  }

  const isMatched = await bcrypt.compare(currentPassword, user.password);

  if (!isMatched) {
    message = "Incorrect current password";

    return res.status(StatusCodes.BAD_REQUEST).json({ success, message });
  }

  const hashedNewPassword = await bcrypt.hash(password, SALT_ROUND);

  user.password = hashedNewPassword;

  await user.save();

  success = true;
  message = "Password changed successfully";

  return res.status(StatusCodes.OK).json({ success, message });
};

export const loginUser = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
      const { email, password } = req.body;
  
      const data = await loginUserService(email, password);
  
      res.status(StatusCodes.OK).json({
        message: 'success',
        token: data
      });
  };
  
  export const logoutUser = async (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(" ")[1]!;
  
    try {
      const message = await logoutUserService(token);
  
      res.status(StatusCodes.OK).json({ message });
    } catch (error) {
      console.error(error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Server Error" });
    }
  };
  