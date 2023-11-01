import { Router } from "express";
import { bodySchemaValidator } from "../middlewares/schema.validator";
import hasPermission from "../middlewares/permission.middleware";
import { CREATE_USER, READ_USER } from "../common/permissions";
import AuthController from "../controllers/auth.controller";
import { LoginData, ResetPasswordRequest, SignUpData } from "../schemas/auth";

const authRouter = Router({ mergeParams: true });

const authController = new AuthController();

authRouter.post(
  "/signup",
  hasPermission(CREATE_USER),
  bodySchemaValidator(SignUpData),
  authController.signup
);

authRouter.post(
  "/login",
  hasPermission(READ_USER),
  bodySchemaValidator(LoginData),
  authController.login
);

authRouter.post(
  "/reset-password-request",
  bodySchemaValidator(ResetPasswordRequest),
  authController.resetPasswordRequest
);

export default authRouter;
