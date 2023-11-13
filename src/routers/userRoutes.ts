import express from "express";
import { authenticateToken } from "../middleware/";
import { check } from "express-validator";
import { changeUserPassword, createUser, deleteUser, getUserById, getUsers, loginUser, logoutUser, updateUser } from "../controllers";
import { isAdmin } from "../utils";

const router = express.Router();

router.post(
    "/login",
    [check("password").notEmpty(), check("email").isEmail()],
    loginUser
  );
  
  
router.post("/logout", authenticateToken, logoutUser);

router.post(
  "/create",
  [
    check("firstname").notEmpty(),
    check("lastname").notEmpty(),
    check("password").notEmpty(),
    check("email").isEmail(),
  ],
  createUser
);

router.get("/", authenticateToken, getUsers);

router.put(
  "/password/:id",
  authenticateToken,
  [check("currentPassword").notEmpty(), check("password").notEmpty()],
  changeUserPassword
);

router.get("/:id", authenticateToken, getUserById);

router.put(
  "/:id",
  authenticateToken,
  [
    check("firstname").optional().notEmpty().isString(),
    check("lastname").optional().notEmpty().isString(),
    check("password").optional().notEmpty().isString(),
    check("email").optional().isEmail(),
  ],
  updateUser
);

router.delete("/:id", authenticateToken, isAdmin, deleteUser);

export { router as userRouter };
