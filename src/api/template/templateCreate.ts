import ApiResponseHandler from '../apiResponseHandler';
import TemplateService from '../../services/templateService';
import CustomError from '../../errors/CustomError';
import { PlatformRequest } from '../common';
import { Response } from 'express';
import { getServiceOptions } from '../utilities';
import TemplateSchema from '../../shared/schema/template/TemplateSchema';
import { TemplateDTO } from '../../shared/dto/TemplateDTO';

export default async (req: PlatformRequest, res: Response) => {
  try {
    const templateData = req.body.data as TemplateDTO;

    TemplateSchema.parse(templateData);

    const payload = await new TemplateService(
      getServiceOptions(req),
    ).create(templateData);

    await ApiResponseHandler.success(req, res, payload);
  } catch (error) {
    await ApiResponseHandler.error(
      req,
      res,
      error as CustomError,
    );
  }
};
