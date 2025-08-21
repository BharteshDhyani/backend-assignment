import { PlatformRequest } from '../api/common';
import { Response } from 'express';

export function languageMiddleware(
  req: PlatformRequest,
  _res: Response,
  next: Function,
) {
  req.language = req.headers['accept-language'] || 'en';
  return next();
}
