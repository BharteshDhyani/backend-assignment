import { Types } from "mongoose";
import { IBaseFilter } from "../base/IBaseFilter";

export interface ITeamFilter extends IBaseFilter {
    importHash?: string;
    name?: string;
    teamAdmin?: Types.ObjectId | string;
    members?: Types.ObjectId[] | string[];
    owner?: Types.ObjectId | string;
}