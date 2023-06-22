import type { Response } from 'express';
import httpStatus from 'http-status';
import * as argon2 from 'argon2';
// import jwt, { type JwtPayload } from 'jsonwebtoken';

import prismaClient from '../config/prisma';
import {
  createAccessToken,
  // createRefreshToken,
} from '../utils/generateTokens.util';
// import logger from '../middleware/logger';
import {
  TypedRequest,
  UserSignUpCredentials,
  UserLoginCredentials,
} from '../types/types';

/**
 *
 * @param {TypedRequest<UserSignUpCredentials>} req - The request object that includes user's username and password.
 * @param {Response} res - The response object that will be used to send the HTTP response.
 * @returns {Response} Returns an HTTP response that includes one of the following:
 *   - A 400 BAD REQUEST status code and an error message if the request body is missing any required parameters.
 *   - A 409 CONFLICT status code if the username already exists in the database.
 *   - A 201 CREATED status code and a success message if the new user is successfully created and a verification email is sent.
 *   - A 500 INTERNAL SERVER ERROR status code if there is an error in the server.
 */
export const handleSignUp = async (
  req: TypedRequest<UserSignUpCredentials>,
  res: Response
) => {
  const { username, password } = req.body;

  // 400
  if (!username || !password) {
    return res.status(httpStatus.BAD_REQUEST).json({
      message: 'Username and password are required',
    });
  }

  // check if username is unique
  const checkUsername = await prismaClient.user.findUnique({
    where: {
      username,
    },
  });

  // 409, username already in use
  if (checkUsername) {
    return res.sendStatus(httpStatus.CONFLICT);
  }

  try {
    const hashedPassword = await argon2.hash(password);

    await prismaClient.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    // 200
    res.status(httpStatus.CREATED).json({
      message: 'New user created',
    });
  } catch (err) {
    // 500
    res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
};

/**
 *
 * @param {TypedRequest<UserLoginCredentials>} req - The request object that includes user's username and password.
 * @param {Response} res - The response object that will be used to send the HTTP response.
 *
 * @returns {Response} Returns an HTTP response that includes one of the following:
 *   - A 400 BAD REQUEST status code and an error message if the request body is missing any required parameters.
 *   - A 401 UNAUTHORIZED status code if the user username does not exist in the database or the username is not verified or the password is incorrect.
 *   - A 200 OK status code and an access token if the login is successful and a new refresh token is stored in the database and a new refresh token cookie is set.
 *   - A 500 INTERNAL SERVER ERROR status code if there is an error in the server.
 */
export const handleLogin = async (
  req: TypedRequest<UserLoginCredentials>,
  res: Response
) => {
  const { username, password } = req.body;

  // 400
  if (!username || !password) {
    return res.status(httpStatus.BAD_REQUEST).json({
      message: 'Username and password are required',
    });
  }

  const user = await prismaClient.user.findUnique({
    where: {
      username,
    },
  });

  // 401
  if (!user) {
    return res.sendStatus(httpStatus.UNAUTHORIZED);
  }

  // check password
  try {
    // TODO: req.cookie stuffs goes here!
    if (await argon2.verify(user.password, password)) {
      const accessToken = createAccessToken(user.id);
      // const refreshToken = createRefreshToken(user.id);

      // 200
      return res.json({
        accessToken,
      });
    }

    // 401
    return res.sendStatus(httpStatus.UNAUTHORIZED);
  } catch (err) {
    // 500
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
};
