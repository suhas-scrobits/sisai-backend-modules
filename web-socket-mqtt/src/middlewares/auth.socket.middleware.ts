import * as jwt from "jsonwebtoken";
import { Server, Socket } from "socket.io";

const authSocket = (socket: any, next: any) => {
  const token = socket.handshake?.auth?.token?.split(" ")[1];

  if (!token) {
    return next(new Error("Invalid token"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "");
    socket.user = decoded;
  } catch (err) {
    return next(new Error("Invalid token"));
  }

  next();
};

export default authSocket;
