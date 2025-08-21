import ApiResponseHandler from '../apiResponseHandler';
import TemplateService from '../../services/templateService';
import { PlatformRequest } from '../common';
import { Response } from 'express';
import CustomError from '../../errors/CustomError';
import { getServiceOptions } from '../utilities';

export default async (req: PlatformRequest, res: Response) => {
  try {
    const payload = await new TemplateService(
      getServiceOptions(req),
    ).findAndCountAll(req.query);

    await ApiResponseHandler.success(req, res, payload);
  } catch (error) {
    await ApiResponseHandler.error(
      req,
      res,
      error as CustomError,
    );
  }
};
