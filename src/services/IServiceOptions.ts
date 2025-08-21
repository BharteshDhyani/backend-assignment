import { Mongoose } from 'mongoose';
import { IUser } from '../shared/interfaces/user/IUser';

export interface IServiceOptions {
  language: string;
  currentUser?: IUser;
  database: Mongoose;
}
