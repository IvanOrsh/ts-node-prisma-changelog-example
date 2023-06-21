import jwt from 'jsonwebtoken';
import config from '../config/config';

/**
 * Generates a valid access token
 *
 * @param {number | string} userId
 * @returns Returns a valid access token
 */
export const createAccessToken = (userId: number | string): string => {
  return jwt.sign({ userID: userId }, config.jwt.access_token.secret, {
    expiresIn: config.jwt.access_token.expire,
  });
};

/**
 * Generates a valid refresh token
 *
 * @param {number | string} userId
 * @returns Returns a valid refresh token
 */
export const createRefreshToken = (userId: number | string): string => {
  return jwt.sign({ userId }, config.jwt.refresh_token.secret, {
    expiresIn: config.jwt.refresh_token.expire,
  });
};
