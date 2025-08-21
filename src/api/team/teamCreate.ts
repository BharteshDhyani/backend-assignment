
import ApiResponseHandler from '../apiResponseHandler';
import TeamService from '../../services/teamService';
import CustomError from '../../errors/CustomError';
import { PlatformRequest } from '../common';
import { Response } from 'express';
import { getServiceOptions } from '../utilities';
import TeamSchema from '../../shared/schema/team/teamSchema';
import { TeamDTO } from '../../shared/dto/TeamDTO';

export default async (req: PlatformRequest, res: Response) => {
  try {
    const teamData = req.body.data as TeamDTO;

    TeamSchema.parse(teamData);

    const payload = await new TeamService(
      getServiceOptions(req),
    ).create(teamData);

    await ApiResponseHandler.success(req, res, payload);
  } catch (error) {
    await ApiResponseHandler.error(
      req,
      res,
      error as CustomError,
    );
  }
};
