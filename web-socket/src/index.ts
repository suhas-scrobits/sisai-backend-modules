import "reflect-metadata";
import { Request, Response, NextFunction } from "express";
import * as http from "http";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as express from "express";
import * as morgan from "morgan";

import * as dotenv from "dotenv";

import * as cookieParser from "cookie-parser";
import CronService from "./services/mqtt.service";
import MQTTService from "./services/mqtt.service";
import { Server } from "socket.io";
import authSocket from "./middlewares/auth.socket.middleware";

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

const server = http.createServer(app);

const io = new Server(server, {
  path: "/api/v1/socket.io",
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// middleware for socket auth
io.use((socket, next) => {
  authSocket(socket, next);
});

const _mqttService = new MQTTService();
app.listen(port, async () => {
  console.log("App Started on port", { port });

  try {
    // mqtt connection

    await _mqttService.initialize();
    await _mqttService.listenMqttEvents();

    // socket implementation

    io.on("connection", async (socket) => {
      // query params from socket
      const variableId = socket.handshake["query"]["variableId"];
      // mongo db listener event
      // const changeStream = Asset.watch();
      // changeStream.on("change", (next: any) => {
      //   if (next.operationType === "update") {
      //     const doc = next.updateDescription.updatedFields;
      //     const key = Object.keys(doc)[0];
      //     const newDoc = doc[key];
      //     if (newDoc.variableId === +id) {
      //       io.emit(`variable_${id}`, newDoc); // sending updated data
      //     }
      //   }
      // });
      // error handling
      // changeStream.on("error", (error: any) => {
      //   console.error("Change stream error:", error);
      // });
    });
  } catch (error) {
    console.error(error);
  }
});
