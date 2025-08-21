import { IBase } from '../base/IBase';
export interface ITeamMember {
  _id?: string;
  member: string;
  joined_on?: Date;
  invited_at?: Date;
  status?: 'pending' | 'approved' | 'rejected';
}

export interface ITeam extends IBase {
  name: string;
  teamAdmin: string;
  members: ITeamMember[];
  owner: string;
  invitation: boolean;
}
