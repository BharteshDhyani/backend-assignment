import ApiResponseHandler from '../apiResponseHandler';
import TeamService from '../../services/teamService';
import { PlatformRequest } from '../common';
import { Response } from 'express';
import CustomError from '../../errors/CustomError';
import { getServiceOptions } from '../utilities';

export default async (req: PlatformRequest, res: Response) => {
  try {
    await new TeamService(
      getServiceOptions(req),
    ).import(req.body.data, req.body.importHash);

    await ApiResponseHandler.success(req, res, {});
  } catch (error) {
    await ApiResponseHandler.error(
      req,
      res,
      error as CustomError,
    );
  }
};
