import type { Response } from 'express';
import httpStatus from 'http-status';
import * as argon2 from 'argon2';
// import jwt, { type JwtPayload } from 'jsonwebtoken';

import prismaClient from '../config/prisma';
// import {
//   createAccessToken,
//   createRefreshToken,
// } from '../utils/generateTokens.util';
import logger from '../middleware/logger';
import { TypedRequest, UserSignUpCredentials } from '../types/types';

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
