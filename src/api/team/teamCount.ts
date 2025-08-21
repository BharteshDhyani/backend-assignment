
import ApiResponseHandler from '../apiResponseHandler';
import TeamService from '../../services/teamService';
import CustomError from '../../errors/CustomError';
import { PlatformRequest } from '../common';
import { Response } from 'express';
import { getServiceOptions } from '../utilities';

export default async (req: PlatformRequest, res: Response) => {
  try {
    const payload = await new TeamService(
      getServiceOptions(req),
    ).findAndCountAll({ ...req.query, countOnly: true });

    await ApiResponseHandler.success(req, res, payload);
  } catch (error) {
    await ApiResponseHandler.error(
      req,
      res,
      error as CustomError,
    );
  }
};
