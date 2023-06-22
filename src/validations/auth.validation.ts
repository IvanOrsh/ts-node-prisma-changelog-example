import { ZodType, z } from 'zod';
import type {
  UserSignUpCredentials,
  UserLoginCredentials,
} from '../types/types';

export const signupSchema: { body: ZodType<UserSignUpCredentials> } = {
  body: z.object({
    username: z.string(),
    password: z.string().min(6),
  }),
};

// TODO: gonna be slightly different
export const loginSchema: { body: ZodType<UserLoginCredentials> } = {
  body: z.object({
    username: z.string(),
    password: z.string().min(6),
  }),
};
