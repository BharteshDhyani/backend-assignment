import ApiResponseHandler from '../api/apiResponseHandler';
import Error401 from '../errors/Error401';
import { NextFunction, Response } from 'express';
import { PlatformRequest } from '../api/common';
import MongooseQueryUtils from '../database/utils/mongooseQueryUtils';

/**
 * Authenticates and fills the request with the user if it exists.
 */
export async function authMiddleware(
  req: PlatformRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    req.currentUser = {
      id: MongooseQueryUtils.generateObjectId().toString(),
      email: 'test@test.com',
      firstName: 'Test',
      lastName: 'Candidate',
      fullName: 'Test Candidate',
      roles: ["user"],
    };

    return next();
  } catch (error) {
    console.error(error);
    await ApiResponseHandler.error(
      req,
      res,
      new Error401(),
    );
  }
}
