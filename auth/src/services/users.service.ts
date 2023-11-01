import { EntityManager } from "typeorm";
import { ResourceNotFoundError, ValidationFailedError } from "../common/errors";
import { User } from "../entity/User";
import { encryptString } from "../common/utils";
import { ResetPasswordScehema } from "../schemas/auth";
import { ResetPwdRequestContext } from "../types/types";
import { Link } from "../entity/Link";

class UserService {
  resetPassword = async (
    transactionEntityManager: EntityManager,
    user: ResetPasswordScehema,
    context: ResetPwdRequestContext
  ) => {
    const email = context.auth?.email;
    const password = user.password;
    const hashedPassword = await encryptString(password);

    const linkRepository = await transactionEntityManager.getRepository(Link);

    const currentLink = await linkRepository.findOneBy({
      email: email,
    });

    if (currentLink) {
      try {
        await transactionEntityManager.update(
          User,
          { email: email },
          { password: hashedPassword }
        );

        await transactionEntityManager.softDelete(Link, { email: email });

        return;
      } catch (error) {
        throw new Error(error.message + "While reseting password.");
      }
    }

    throw new ValidationFailedError("link is expired. please try again.");
  };
}

export default UserService;
