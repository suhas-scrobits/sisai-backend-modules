import "reflect-metadata";
import { Request, Response, NextFunction } from "express";

import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as express from "express";
import * as morgan from "morgan";

import * as dotenv from "dotenv";

import * as cookieParser from "cookie-parser";
import CronService from "./services/excel.service";

dotenv.config();

morgan.token("host", function (req: express.Request, _res) {
  return req.hostname;
});

const app = express();

app.use(cookieParser());

app.use(
  morgan(
    ":date[web] :method :host :url :status :res[content-length] - :response-time ms"
  )
);
app.use(cors({ credentials: true, origin: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: "application/json" }));

const port = process.env.PORT || 80;

const _cronService = new CronService();
app.listen(port, async () => {
  console.log("App Started on port", { port });

  try {
    await _cronService.initialize();
  } catch (error) {
    console.error(error);
  }
});
