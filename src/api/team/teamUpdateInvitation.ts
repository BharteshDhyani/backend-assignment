import ApiResponseHandler from '../apiResponseHandler';
import TeamService from '../../services/teamService';
import {
  PlatformRequest,
  TeamMemberRequest,
} from '../common';
import { Response } from 'express';
import CustomError from '../../errors/CustomError';
import { getServiceOptions } from '../utilities';

export default async (
  req: PlatformRequest,
  res: Response,
) => {
  try {
    const { teamId, memberId } =
      req.params as unknown as TeamMemberRequest;
    const { status } = req.body;

    const payload = await new TeamService(
      getServiceOptions(req),
    ).updateInvitationStatus(teamId, memberId, status);

    await ApiResponseHandler.success(req, res, payload);
  } catch (error) {
    await ApiResponseHandler.error(
      req,
      res,
      error as CustomError,
    );
  }
};
