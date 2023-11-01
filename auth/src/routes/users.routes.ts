import { Router } from "express";
import UserController from "../controllers/users.controller";
import { bodySchemaValidator } from "../middlewares/schema.validator";
import { AddUser, UpdateUser } from "../schemas/user";
import hasPermission from "../middlewares/permission.middleware";
import {
  CREATE_USER,
  DELETE_USER,
  READ_USER,
  READ_USERS,
  UPDATE_USER,
} from "../common/permissions";
import { ResetPassword } from "../schemas/auth";

const userRouter = Router({ mergeParams: true });

const userController = new UserController();

userRouter.post(
  "/reset-password",
  bodySchemaValidator(ResetPassword),
  userController.resetPassword
);

export default userRouter;
