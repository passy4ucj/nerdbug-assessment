import { Router } from "express";

import { userRouter } from "./userRoutes";

const router = Router();

router.use("/users", userRouter);

export { router as applicationRoutes };
