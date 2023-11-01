import { Router } from "express";
import authRouter from "./auth.routes";
import userRouter from "./users.routes";

const router = Router({ mergeParams: true });

router.use("/users/auth", authRouter);
router.use("/users", userRouter);

export default router;
