import { RequestHandler } from "express";
import { LoginDataSchema, SignUpDataScehema } from "../schemas/auth";
import AuthService from "../services/auth.service";
import { buildResponse } from "../common/utils";
import { errorHandler } from "../common/errors";
import { AppDataSource } from "../data-source";
import { jwtCookieName, userJwtTokenValidDays } from "../common/constants";

class AuthController {
  _authService = new AuthService();

  login: RequestHandler = async (req, res) => {
    try {
      const loginData: LoginDataSchema = req.body;
      const { jwtToken, user } = await this._authService.login(loginData);
      return res
        .status(200)
        .cookie(jwtCookieName, jwtToken, {
          httpOnly: true,
          secure: true, // https only
          maxAge: userJwtTokenValidDays * 24 * 60 * 60 * 1000,
          sameSite: "none",
        })
        .send(buildResponse({ jwtToken, user }, "Login successfully"));
    } catch (error) {
      errorHandler(res, error);
    }
  };

  signup: RequestHandler = async (req, res) => {
    try {
      const signUpData: SignUpDataScehema = req.body;

      const { jwtToken, user } = await AppDataSource.transaction(
        async (transactionEntityManager) => {
          const data = await this._authService.signup(
            transactionEntityManager,
            signUpData
          );

          return data;
        }
      );

      return res
        .status(200)
        .send(buildResponse({ jwtToken, user }, "Signup successfully"));
    } catch (error) {
      errorHandler(res, error);
    }
  };

  resetPasswordRequest: RequestHandler = async (req, res) => {
    try {
      await AppDataSource.transaction(async (transactionEntityManager) => {
        await this._authService.resetPasswordRequest(
          transactionEntityManager,
          req.body
        );
      });

      return res
        .status(200)
        .send(
          buildResponse("", "Please check your email. link has been sent.")
        );
    } catch (error) {
      errorHandler(res, error);
    }
  };
}

export default AuthController;
