import { Transporter, createTransport } from "nodemailer";
import logger from "../common/logger";

class MailService {
  transporter: Transporter = createTransport({
    host: "smtp.gmail.com",
    port: Number.parseInt(process.env.SMTP_PORT ?? "465"),
    secure: true,
    auth: {
      user: process.env.SMTP_USER_NAME,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  sendMail = async (
    to: string,
    subject: string,
    message: string,
    attachment: any
  ) => {
    try {
      await this.transporter.verify();

      await this.transporter.sendMail({
        from: process.env.SMTP_USER_NAME,
        to: to,
        subject,
        html: message,
        attachments: [attachment],
      });

      return;
    } catch (error) {
      logger.error(error.message);
      throw new Error(error.message);
    }
  };
}

export default MailService;
