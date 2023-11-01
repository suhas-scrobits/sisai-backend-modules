import * as XLSX from "xlsx";
import {
  EMAIL_TEMPLATE_REPORT,
  REPORT_BODY,
} from "../templates/email.template";
import MailService from "./mail.service";

class ExcelService {
  private _mailService = new MailService();

  createAndSendExcel = async (report: { message: ""; email: "" }) => {
    try {
      const variable = [
        {
          value: 214.92,
          timestamp: 1697540845,
          variableId: 3817,
          _id: "652e6aed316dd7dbf2ba9b48",
        },
        {
          value: 125.89,
          timestamp: 1697543305,
          variableId: 3817,
          _id: "652e748af1a899e322b2139f",
        },
        {
          value: 215.8,
          timestamp: 1697543716,
          variableId: 3817,
          _id: "652e7624f1a899e322b3c487",
        },
        {
          value: 126.6,
          timestamp: 1697545356,
          variableId: 3817,
          _id: "652e7c8cf1a899e322bb5e4b",
        },
        {
          value: 149.51,
          timestamp: 1697545766,
          variableId: 3817,
          _id: "652e7e26f1a899e322bdb208",
        },
        {
          value: 239.81,
          timestamp: 1697546996,
          variableId: 3817,
          _id: "652e82f4f1a899e322c3be40",
        },
        {
          value: 149.37,
          timestamp: 1697549047,
          variableId: 3817,
          _id: "652e8af7f1a899e322cfef29",
        },
        {
          value: 146.06,
          timestamp: 1697549457,
          variableId: 3817,
          _id: "652e8c91f1a899e322d2baec",
        },
        {
          value: 167.92,
          timestamp: 1697550687,
          variableId: 3817,
          _id: "652e915ff1a899e322db3dc5",
        },
        {
          value: 176.44,
          timestamp: 1697551917,
          variableId: 3817,
          _id: "652e962df1a899e322e437a3",
        },
        {
          value: 223.73,
          timestamp: 1697553558,
          variableId: 3817,
          _id: "652e9c96f1a899e322f0c394",
        },
        {
          value: 205.39,
          timestamp: 1697553968,
          variableId: 3817,
          _id: "652e9e30f1a899e322f42a5c",
        },
        {
          value: 130.71,
          timestamp: 1697556428,
          variableId: 3817,
          _id: "652ea7ccf1a899e322098f55",
        },
        {
          value: 207.64,
          timestamp: 1697556838,
          variableId: 3817,
          _id: "652ea966296807cf7b056f95",
        },
        {
          value: 123.03,
          timestamp: 1697558889,
          variableId: 3817,
          _id: "652eb169296807cf7b1a82d3",
        },
        {
          value: 160.98,
          timestamp: 1697559299,
          variableId: 3817,
          _id: "652eb303296807cf7b1e8f67",
        },
      ];

      const data = variable;

      const wb = XLSX.utils.book_new();

      const ws = XLSX.utils.json_to_sheet(data);

      XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");

      const excelFileName = `variable.xlsx`;

      const excelBuffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

      const attachment = {
        filename: excelFileName,
        content: excelBuffer,
      };

      const htmlTemplate = report.message
        ? EMAIL_TEMPLATE_REPORT.replace("{{BODY}}", report.message)
        : EMAIL_TEMPLATE_REPORT.replace("{{BODY}}", REPORT_BODY);

      await this._mailService.sendMail(
        report.email,
        "Subject line",
        htmlTemplate
      );
      return;
    } catch (error) {
      throw new Error(error);
    }
  };
}

export default ExcelService;
