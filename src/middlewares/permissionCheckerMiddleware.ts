import ApiResponseHandler from '../api/apiResponseHandler';
import { Request, Response } from 'express';
import { PlatformRequest } from '../api/common';
import CustomError from '../errors/CustomError';

export function permissionCheckerMiddleware(
) {
  return (
    req: PlatformRequest,
    res: Response,
    next: Function,
  ) => {
    try {
      const reqWithUser = req as Request & {
        language: string;
        currentUser: any;
      };
      if (!reqWithUser.currentUser) {
        throw new CustomError('User not authenticated');
      }

      next();
    } catch (error) {
      ApiResponseHandler.error(
        req,
        res,
        error as CustomError,
      );
    }
  };
}
