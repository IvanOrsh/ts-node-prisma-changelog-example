import type { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import jwt, { type JwtPayload } from 'jsonwebtoken';

import config from '../../src/config/config';

const isAuth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers?.authorization;

  if (!authHeader || !authHeader?.startsWith('Bearer ')) {
    return res.sendStatus(httpStatus.UNAUTHORIZED);
  }

  const [, token] = authHeader.split(' ');

  if (!token) {
    return res.sendStatus(httpStatus.UNAUTHORIZED);
  }

  try {
    const payload = jwt.verify(token, config.jwt.access_token.secret);
    req.payload = payload as JwtPayload;
    console.log(payload);
    next();
    return;
  } catch (err) {
    return res.sendStatus(httpStatus.FORBIDDEN);
  }
};

export default isAuth;
