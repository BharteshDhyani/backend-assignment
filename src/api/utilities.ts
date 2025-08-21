import { NextFunction, Router } from 'express';
import { IServiceOptions } from '../services/IServiceOptions';
import {
  AuthenticatedRequest,
  PlatformRequest,
} from './common';
import Permissions from '../security/permissions';
import { authMiddleware } from '../middlewares/authMiddleware';
import { Response } from 'express';
import { permissionCheckerMiddleware } from '../middlewares/permissionCheckerMiddleware';
import { Mongoose } from 'mongoose';

export const createRoute = (
  router: Router,
  method: 'get' | 'put' | 'post' | 'delete' | 'patch',
  path: string,
  options: {
    auth?: boolean;
    permission?: Permissions;
  },
  handler: (
    req: PlatformRequest,
    res: Response,
    next?: NextFunction,
  ) => void,
) => {
  const middlewares: Array<
    (
      req: PlatformRequest,
      res: Response,
      next: NextFunction,
    ) => void
  > = [];

  if (options.auth) {
    middlewares.push(authMiddleware);
  }

  if (options.permission) {
    middlewares.push(
      permissionCheckerMiddleware(),
    );
  }

  // Add route dynamically
  router[method](path, ...middlewares, handler);
};

export const getServiceOptions = (
  req: PlatformRequest | AuthenticatedRequest,
): IServiceOptions => {
  return {
    language: req.language as string,
    currentUser: req.currentUser,
    database: req.database as Mongoose,
  };
};
