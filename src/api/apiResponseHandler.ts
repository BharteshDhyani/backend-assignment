import { Response } from 'express';
import CustomError from '../errors/CustomError';
import { PlatformRequest } from './common';
import { ZodError } from 'zod/v4';

export default class ApiResponseHandler {
  static async download(
    _req: PlatformRequest,
    res: Response,
    path: string,
  ) {
    res.download(path);
  }

  static async success(
    _req: PlatformRequest,
    res: Response,
    payload: Record<string, any>,
  ) {
    if (payload !== undefined) {
      res.status(200).send({
        succes: true,
        data: payload,
      });
    } else {
      res.sendStatus(200);
    }
  }

  static async error(
    _req: PlatformRequest,
    res: Response,
    error: CustomError,
  ) {
    let message =
      error?.message || 'An unexpected error occurred';
    if (error?.name === 'ZodError') {
      const zodIssues = (error as unknown as ZodError)
        .issues;
      message =
        zodIssues?.map((e) => e.message).join(', ') ||
        message;
      // z.prettifyError(
      //   error as unknown as ZodError,
      // );
    }

    if (
      error &&
      [400, 401, 403, 404].includes(error.code)
    ) {
      res
        .status(error.code)
        .send({ success: false, error: message });
    } else {
      console.error(error);
      res
        .status(500)
        .send({ success: false, error: message });
    }
  }
}
