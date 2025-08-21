
import ApiResponseHandler from '../apiResponseHandler';
import TeamService from '../../services/teamService';
import { PlatformRequest } from '../common';
import { Response } from 'express';
import CustomError from '../../errors/CustomError';
import { getServiceOptions } from '../utilities';
import { AutoCompleteRequest } from '../../shared/type/base/AutoCompleteRequest';

export default async (req: PlatformRequest, res: Response) => {
  try {
    const payload = await new TeamService(
      getServiceOptions(req),
    ).findAllAutocomplete(
      (req.query as unknown as AutoCompleteRequest).query,
      (req.query as unknown as AutoCompleteRequest).limit,
    );

    await ApiResponseHandler.success(req, res, payload);
  } catch (error) {
    await ApiResponseHandler.error(
      req,
      res,
      error as CustomError,
    );
  }
};
