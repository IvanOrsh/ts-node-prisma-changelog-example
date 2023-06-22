import { ZodType, z } from 'zod';
import type { UserSignUpCredentials } from '../types/types';

export const signupSchema: { body: ZodType<UserSignUpCredentials> } = {
  body: z.object({
    username: z.string(),
    password: z.string().min(6),
  }),
};
