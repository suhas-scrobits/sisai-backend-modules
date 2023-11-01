import * as cron from "node-cron";

class CronService {
  initialize = async () => {
    // run cron service every 2 days

    cron.schedule("0 0 */2 * *", async () => {
      await this.updateDeviceStatus();
      await this.sendEmail();
    });
  };

  updateDeviceStatus = async () => {
    // logic for to know if device is not sending data for last 2 days
    // const deviceRepository = await AppDataSource.getRepository(Device);
    // const reports = await deviceRepository
    //   .createQueryBuilder("device")
    //   .select(["device.id", "device.updatedAt"])
    //   .where(`(device.updatedAt < :currentDay )`, {
    //     currentDay: new Date(
    //       new Date().getTime() - 48 * 3600 * 1000
    //     ).toISOString(),
    //   })
    //   .andWhere({ isActive: true })
    //   .getMany();
    // const deviceIds = reports.map((device) => device.id);
    // try {
    //   await deviceRepository
    //     .createQueryBuilder("updateDeviceStatus")
    //     .update(Device)
    //     .set({ isActive: false })
    //     .whereInIds(deviceIds)
    //     .execute();
    // } catch (error) {
    //   console.log("error while updating device status", error);
    // }
  };

  sendEmail = async () => {
    // logic to send emails over some frequent time interval
    // const reportRepository = await AppDataSource.getRepository(Report);
    // const reports = await reportRepository
    //   .createQueryBuilder("report")
    //   .leftJoinAndSelect("report.emails", "emails")
    //   .where(
    //     `(report.lastUpdatedAt + (report.frequency*${3600}) <= :currentTimestamp )`,
    //     {
    //       currentTimestamp: Math.floor(Date.now() / 1000),
    //     }
    //   )
    //   .getMany();
    // await Promise.all(
    //   reports.map(async (report) => {
    //     if (report.isActive) {
    //       const emails = report.emails.map((email) => email.email);
    //       const link = `${process.env.FRONTEND_URL}/layout/dashboard/${report.dashboardId}`;
    //       const htmlTemplate = EMAIL_TEMPLATE_DASHBOARD_REPORT.replace(
    //         "{DASHBOARD_URL}",
    //         link
    //       );
    //       const mailOptions = {
    //         from: process.env.SMTP_USER_NAME,
    //         to: emails.join(", "),
    //         subject: `Dashboard Access Granted - Crow Sensor`,
    //         html: htmlTemplate,
    //       };
    //       await this._userAuthService.transporter.sendMail(mailOptions);
    //       await AppDataSource.createQueryBuilder()
    //         .update(Report)
    //         .set({ lastUpdatedAt: Math.floor(Date.now() / 1000) - 60 })
    //         .where("id = :id", { id: report.id })
    //         .execute();
    //     }
    //   })
    // );
  };
}

export default CronService;
