import base64url from "base64url";
import { userJwtTokenValidDays } from "../common/constants";
import { ResourceNotFoundError, ValidationFailedError } from "../common/errors";
import { AppDataSource } from "../data-source";
import { Link } from "../entity/Link";
import { User } from "../entity/User";
import {
  LoginDataSchema,
  ResetPasswordRequestScehema,
  SignUpDataScehema,
} from "../schemas/auth";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { EntityManager } from "typeorm";
import { EMAIL_TEMPLATE_RESET_PASSWORD } from "../templates/email.template";
import MailService from "./mail.service";

class AuthService {
  private _mailService = new MailService();

  login = async (loginData: LoginDataSchema) => {
    const userRepository = await AppDataSource.getRepository(User);
    const user = await userRepository
      .createQueryBuilder("user")
      .where({
        email: loginData.email,
      })
      .select([
        "user.id",
        "user.firstName",
        "user.lastName",
        "user.email",
        "user.password",
      ])
      .getOne();

    if (!user) {
      throw new ResourceNotFoundError(`user not found`);
    }

    const isMatching = user.password
      ? await bcrypt.compare(loginData.password, user.password)
      : false;

    if (!isMatching) {
      throw new ValidationFailedError(`wrong password`);
    }

    const jwtToken = jwt.sign(
      {
        id: user.id,
      },
      process.env.JWT_SECRET ?? "",
      { expiresIn: `${userJwtTokenValidDays}d` }
    );

    const newUserData = { ...user };
    delete newUserData.password;

    return { user: newUserData, jwtToken };
  };

  signup = async (
    transactionEntityManager: EntityManager,
    user: SignUpDataScehema
  ) => {
    const userRepository = await transactionEntityManager.getRepository(User);

    const duplicateEmailUser = await userRepository.findOneBy({
      email: user.email,
    });

    if (duplicateEmailUser) {
      throw new ValidationFailedError(`user already exists`);
    }

    const dbUser = new User();
    dbUser.email = user.email;
    dbUser.firstName = user.firstName;
    dbUser.lastName = user.lastName;
    dbUser.password = user.password;

    const savedUser = await transactionEntityManager.save(dbUser);

    const jwtToken = jwt.sign(
      {
        id: savedUser.id,
      },
      process.env.JWT_SECRET ?? "",
      { expiresIn: `${userJwtTokenValidDays}d` }
    );

    const newUserData = { ...savedUser };
    delete newUserData.password;

    return { user: newUserData, jwtToken };
  };

  resetPasswordRequest = async (
    transactionEntityManager: EntityManager,
    data: ResetPasswordRequestScehema
  ) => {
    const userRepository = await transactionEntityManager.getRepository(User);

    const currentUser = await userRepository.findOneBy({
      email: data.email,
    });

    if (currentUser) {
      const linkRepository = await transactionEntityManager.getRepository(Link);

      const findLink = await linkRepository.findOneBy({
        email: data.email,
      });

      if (findLink) {
        await linkRepository.softDelete({ email: data.email });
      }

      const jwtToken = jwt.sign(
        {
          email: data.email,
        },
        process.env.JWT_SECRET ?? "",
        { expiresIn: `${365}d` }
      );

      const newToken = base64url(jwtToken);

      const resetLink = `${process.env.FRONTEND_URL}/${data.email}/${newToken}`;

      const dbLink = new Link();
      dbLink.email = data.email;
      dbLink.link = resetLink;

      await transactionEntityManager.save(dbLink);

      const subject = `Reset Your App Name Account Password`;

      const message = EMAIL_TEMPLATE_RESET_PASSWORD.replace(
        "{PASSWORD_RESET_URL}",
        resetLink
      );

      await this._mailService.sendMail(data.email, subject, message);
      return;
    }

    throw new ResourceNotFoundError(`user not found`);
  };
}

export default AuthService;
