import type { NextFunction, Request } from 'express';
import { z } from 'zod';
import httpMocks from 'node-mocks-http';

import validate from '../../src/middleware/validate';

describe('validate middleware', () => {
  const schema = z.object({
    name: z.string().min(3),
  });
  let req: Request;
  let next: NextFunction;

  beforeEach(() => {
    next = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('should call next() when input data is valid', () => {
    const middleware = validate({ body: schema });

    req = httpMocks.createRequest({
      method: 'POST',
      url: '/users',
      body: { name: 'John' },
    });

    const res = httpMocks.createResponse();

    middleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.statusCode).toBe(200);
  });

  test('should send 400 error response when input data is invalid', () => {
    const middleware = validate({ body: schema });

    req = httpMocks.createRequest({
      method: 'POST',
      url: '/users',
      body: { name: 'Pi' },
    });

    const res = httpMocks.createResponse();

    middleware(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(400);
    expect(res._isJSON()).toBeTruthy();
    expect(res._getData()).toEqual(
      '{"errors":[{"field":"body, name","message":"String must contain at least 3 character(s)"}]}'
    );
  });
});
