import { ErrorRequestHandler } from "express";
import { ForbiddenError } from "../common/errors";
import logger from "../common/logger";
import { buildResponse } from "../common/utils";

const errorMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    res.status(401).send("Invalid token");
  } else if (err instanceof ForbiddenError) {
    res.status(403).send(buildResponse(null, err.message, "failure"));
  } else if (err.name === "ZodError") {
    res.status(400).send(buildResponse(null, err.issues, "failure"));
  } else {
    res
      .status(404)
      .send(buildResponse(null, `Not Found - ${req.originalUrl}`, "failure"));
  }
  next();
};

export default errorMiddleware;
