import { ZodType, z } from 'zod';
import type { UserSignUpCredentials } from '../types/types';

type SignUpSchemaType = ZodType<{
  body: UserSignUpCredentials;
}>;

export const signupSchema: SignUpSchemaType = z.object({
  body: z.object({
    username: z.string().min(2),
    password: z.string().min(6),
  }),
});
