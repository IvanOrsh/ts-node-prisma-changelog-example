import httpStatus from 'http-status';
import type { NextFunction, Request, Response } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken';

import isAuth from '../../src/middleware/isAuth';
import config from '../../src/config/config';

describe('isAuth middleware', () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    req = {} as Request;
    res = {
      sendStatus: jest.fn(),
    } as unknown as Response;
    next = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('should return 401 if no authorization header is present', () => {
    isAuth(req, res, next);

    expect(res.sendStatus).toHaveBeenCalledWith(httpStatus.UNAUTHORIZED);
    expect(next).not.toHaveBeenCalled();
  });

  test('should return 401 if token is undefined', () => {
    req.headers = { authorization: 'Bearer  ' };

    isAuth(req, res, next);

    expect(res.sendStatus).toHaveBeenCalledWith(httpStatus.UNAUTHORIZED);
    expect(next).not.toHaveBeenCalled();
  });

  test('should return 403 if token is invalid', () => {
    req.headers = { authorization: 'Bearer invalid.token' };

    isAuth(req, res, next);

    expect(res.sendStatus).toHaveBeenCalledWith(httpStatus.FORBIDDEN);
    expect(next).not.toHaveBeenCalled();
  });

  test('should call next() if token is valid', () => {
    const payload: JwtPayload = { userId: 1 };
    const token = jwt.sign(payload, config.jwt.access_token.secret);

    req.headers = { authorization: `Bearer ${token}` };

    isAuth(req, res, next);

    expect(req.payload).toBeDefined();
    expect(next).toHaveBeenCalled();
  });
});
