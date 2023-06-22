import type { Request, Response } from 'express';

import { errorHandler } from '../../src/middleware/errorHandler'; // Import the errorHandler middleware
import logger from '../../src/middleware/logger'; // Import the logger module

jest.mock('../../src/middleware/logger'); // Mock the logger module

describe('errorHandler middleware', () => {
  let req: Request;
  let res: Response;
  let err: Error;

  beforeEach(() => {
    req = {} as Request;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    err = new Error('Test error');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should log the error and send 500 error response with the error message', () => {
    errorHandler(err, req, res);

    expect(logger.error).toHaveBeenCalledTimes(1);
    expect(logger.error).toHaveBeenCalledWith(err);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Test error' });
  });
});
