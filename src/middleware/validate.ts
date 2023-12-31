import type { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { z, ZodType } from 'zod';

import type { RequireAtLeastOne } from '../types/types';

type RequestValidationSchema = RequireAtLeastOne<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Record<'body' | 'query' | 'params', ZodType<any, any, any>>
>;

const validate =
  (schema: RequestValidationSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    const validator = z.object(schema);

    try {
      validator.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map((err) => ({
          field: err.path.join(', '),
          message: err.message,
        }));

        res.status(httpStatus.BAD_REQUEST).json({ errors });
      }
    }
  };

export default validate;
