import { RequestHandler } from "express";
import { buildResponse } from "../common/utils";
import { AppDataSource } from "../data-source";
import UserService from "../services/users.service";
import logger from "../common/logger";
import {
  ResourceNotFoundError,
  ValidationFailedError,
  errorHandler,
} from "../common/errors";
import {
  CustomRequest,
  ResetPwdJwtPayload,
  ResetPwdRequest,
} from "../types/types";

class UserController {
  private _usersService = new UserService();

  resetPassword: RequestHandler = async (req: ResetPwdRequest, res) => {
    try {
      await AppDataSource.transaction(async (transactionEntityManager) => {
        await this._usersService.resetPassword(
          transactionEntityManager,
          req.body,
          req.context
        );
      });

      return res.send(buildResponse("", "Password changed successfully."));
    } catch (error) {
      errorHandler(res, error);
    }
  };
}

export default UserController;
