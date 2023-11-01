import { Request } from "express";

export interface JwtPayload {
  id: number;
}

export type RequestContext = {
  auth?: JwtPayload;
};

export type CustomRequest = Request & { context: RequestContext };

export interface ResetPwdJwtPayload {
  email: string;
}

export type ResetPwdRequestContext = {
  auth?: ResetPwdJwtPayload;
};

export type ResetPwdRequest = Request & { context: ResetPwdRequestContext };
