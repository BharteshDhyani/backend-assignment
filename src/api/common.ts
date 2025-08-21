import mongoose from 'mongoose';
import { IUser } from '../shared/interfaces/user/IUser';
import { Request } from 'express';

export interface PlatformRequest extends Request {
  database?: mongoose.Mongoose;
  language?: string;
  currentUser?: IUser;
  correlationId?: () => string;
}

export interface TypedRequestBody<T> extends PlatformRequest {
  body: T;
}

export interface AuthenticatedRequest extends PlatformRequest {
  currentUser: IUser;
}

export interface RequestWithId extends PlatformRequest {
  id: string;
}

export interface TeamMemberRequest extends PlatformRequest {
  teamId: string;
  memberId: string;
}

