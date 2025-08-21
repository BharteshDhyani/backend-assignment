import ApiResponseHandler from '../apiResponseHandler';
import TemplateService from '../../services/templateService';
import { PlatformRequest } from '../common';
import { Response } from 'express';
import CustomError from '../../errors/CustomError';
import { getServiceOptions } from '../utilities';
import { DeleteRequest } from '../../shared/type/shared/DeleteRequest';

export default async (req: PlatformRequest, res: Response) => {
  try {
    await new TemplateService(
      getServiceOptions(req),
    ).destroyAll(
      (req.query as unknown as DeleteRequest).ids,
    );

    await ApiResponseHandler.success(req, res, {});
  } catch (error) {
    await ApiResponseHandler.error(
      req,
      res,
      error as CustomError,
    );
  }
};
