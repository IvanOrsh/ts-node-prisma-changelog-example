import * as dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

dotenv.config({
  path: path.resolve(__dirname, '../../.env'),
});

const envSchema = z.object({
  NODE_ENV: z.string().refine((_) => ['production', 'development', 'test']),
  PORT: z.string().default('8000'),
  SERVER_URL: z.string(),

  ACCESS_TOKEN_SECRET: z.string().min(8),
  REFRESH_TOKEN_SECRET: z.string().min(8),
  ACCESS_TOKEN_EXPIRE: z.string().default('1d'),
  REFRESH_TOKEN_EXPIRE: z.string().default('1d'),

  DB_DATABASE: z.string().default('postgres'),
  DB_PASSWORD: z.string().default('postgres'),
  DB_PORT: z.string().default('5432'),
  DB_SCHEMA: z.string().default('public'),

  DATABASE_URL: z
    .string()
    .default(
      'postgresql://postgres:postgres@localhost:5432/postgres?schema=public'
    ),
});

console.log(process.env['ACCESS_TOKEN_SECRET']);

const validateEnv = envSchema.parse(process.env);

const config = {
  node_env: validateEnv.NODE_ENV,
  server: {
    port: validateEnv.PORT,
    url: validateEnv.SERVER_URL,
  },
  jwt: {
    access_token: {
      secret: validateEnv.ACCESS_TOKEN_SECRET,
      expire: validateEnv.ACCESS_TOKEN_EXPIRE,
    },
    refresh_token: {
      secret: validateEnv.REFRESH_TOKEN_SECRET,
      expire: validateEnv.REFRESH_TOKEN_EXPIRE,
    },
  },
} as const;

export default config;
