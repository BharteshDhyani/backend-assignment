import { PlatformRequest } from '../api/common';
import { databaseInit } from '../database/databaseConnection';
import { Response } from 'express';

export async function databaseMiddleware(
  req: PlatformRequest,
  _res: Response,
  next: Function,
) {
  try {
    const database = await databaseInit();
    req.database = database;
  } catch (error) {
    console.error(error);
  } finally {
    next();
  }
}
