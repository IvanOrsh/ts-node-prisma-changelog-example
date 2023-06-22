import type { NextFunction, Request, Response } from 'express';
import type { DeepPartial } from 'utility-types';

export type RequireAtLeastOne<T> = {
  [K in keyof T]-?: Required<Pick<T, K>> &
    Partial<Pick<T, Exclude<keyof T, K>>>;
}[keyof T];

// More strictly typed Express.Request type
export type TypedRequest<
  ReqBody = Record<string, unknown>,
  QueryString = Record<string, unknown>
> = Request<
  Record<string, unknown>,
  Record<string, unknown>,
  DeepPartial<ReqBody>,
  DeepPartial<QueryString>
>;

export type ExpressMiddleware<
  ReqBody = Record<string, unknown>,
  Res = Record<string, unknown>,
  QueryString = Record<string, unknown>
> = (
  req: TypedRequest<ReqBody, QueryString>,
  res: Response<Res>,
  next: NextFunction
) => Promise<void> | void;

// sign up credentials: username, password
// TODO: email?
export interface UserSignUpCredentials {
  username: string;
  password: string;
}

// login credentials: username, password
// TODO: omit email or username
export type UserLoginCredentials = Omit<UserSignUpCredentials, ''>;
