import MongooseRepository from './mongooseRepository';
import MongooseQueryUtils from '../utils/mongooseQueryUtils';
import Error404 from '../../errors/Error404';
import { IRepositoryOptions } from './IRepositoryOptions';
import lodash from 'lodash';
import Team from '../models/team';
import mongoose from 'mongoose';
import { ITeam } from '../../shared/interfaces/team/ITeam';
import { TeamDocument } from '../models/team';
import { TeamRequest } from '../../shared/type/team/teamRequest';
import { TeamDTO } from '../../shared/dto/TeamDTO';

class TeamRepository {
  static async create(
    data: TeamDTO,
    options: IRepositoryOptions,
  ): Promise<ITeam> {
    const currentUser =
      MongooseRepository.getCurrentUser(options);

    const members = (data.members || []).map((member) => ({
      member: member.member,
      joined_on: member.joined_on,
      invited_at: member.invited_at,
      status: member.status || 'pending',
    }));

    const record: TeamDocument =
      (await MongooseRepository.wrapWithSessionIfExists(
        Team(options.database).create({
          ...data,
          members,
          createdBy: currentUser.id,
          updatedBy: currentUser.id,
        }),
        options,
      )) as TeamDocument;

    return this.findById(record.id, options);
  }

  static async update(
    id: string,
    data: TeamDTO,
    options: IRepositoryOptions,
  ) {
    let record =
      await MongooseRepository.wrapWithSessionIfExists(
        Team(options.database).findOne({
          _id: id,
        }),
        options,
      );

    if (!record) {
      throw new Error404();
    }

    await MongooseRepository.wrapWithSessionIfExists(
      await Team(options.database).updateOne(
        { _id: id },
        {
          ...data,
          updatedBy:
            MongooseRepository.getCurrentUser(options).id,
        },
      ),
      options,
    );

    record = await this.findById(id, options);

    return record;
  }

  static async destroy(
    id: string,
    options: IRepositoryOptions,
  ): Promise<boolean> {
    let record =
      await MongooseRepository.wrapWithSessionIfExists(
        Team(options.database).findOne({
          _id: id,
        }),
        options,
      );

    if (!record) {
      throw new Error404();
    }

    await MongooseRepository.wrapWithSessionIfExists(
      await Team(options.database).deleteOne({
        _id: id,
      }),
      options,
    );

    return true;
  }

  static async filterId(
    id: string,
    options: IRepositoryOptions,
  ): Promise<string | null> {
    return lodash.get(
      await this.filterIds([id], options),
      '[0]',
      null,
    ) as string | null;
  }

  static async filterIds(
    ids: string[],
    options: IRepositoryOptions,
  ): Promise<[] | Array<string>> {
    if (!ids || !ids.length) {
      return [];
    }

    const records = await Team(options.database)
      .find({
        _id: { $in: ids },
      })
      .select(['_id']);

    return records.map(
      (record: TeamDocument) => record._id,
    ) as Array<string>;
  }

  static async count(
    filter: Partial<ITeam>,
    options: IRepositoryOptions,
  ): Promise<number> {
    return MongooseRepository.wrapWithSessionIfExists(
      Team(options.database).countDocuments({
        ...filter,
      }),
      options,
    );
  }

  static async findById(
    id: string,
    options: IRepositoryOptions,
  ): Promise<ITeam> {
    let record =
      await MongooseRepository.wrapWithSessionIfExists(
        Team(options.database).findOne({
          _id: id,
        }),
        options,
      );

    if (!record) {
      throw new Error404();
    }

    return record.toObject ? record.toObject() : record;
  }

  static async findAndCountAll(
    {
      filter,
      limit = 0,
      offset = 0,
      orderBy = '',
      countOnly = false,
    }: TeamRequest,
    options: IRepositoryOptions,
  ): Promise<{
    count: number;
    rows?: Array<ITeam | undefined>;
  }> {
    let criteriaAnd: any = [];

    if (filter) {
      if (filter.id) {
        criteriaAnd.push({
          ['_id']: MongooseQueryUtils.uuid(
            new mongoose.Types.ObjectId(filter.id),
          ),
        });
      }
      if (filter.name) {
        criteriaAnd.push({
          name: {
            $regex: MongooseQueryUtils.escapeRegExp(
              filter.name,
            ),
            $options: 'i',
          },
        });
      }
      if (filter.teamAdmin) {
        criteriaAnd.push({
          teamAdmin: MongooseQueryUtils.uuid(
            new mongoose.Types.ObjectId(
              filter.teamAdmin as string,
            ),
          ),
        });
      }
      if (filter.owner) {
        criteriaAnd.push({
          owner: MongooseQueryUtils.uuid(
            new mongoose.Types.ObjectId(
              filter.owner as string,
            ),
          ),
        });
      }

      if (filter.createdAtRange) {
        const [start, end] = filter.createdAtRange;

        if (
          start !== undefined &&
          start !== null &&
          start !== ''
        ) {
          criteriaAnd.push({
            ['createdAt']: {
              $gte: start,
            },
          });
        }

        if (
          end !== undefined &&
          end !== null &&
          end !== ''
        ) {
          criteriaAnd.push({
            ['createdAt']: {
              $lte: end,
            },
          });
        }
      }
    }

    const sort = MongooseQueryUtils.sort(
      orderBy || 'createdAt_DESC',
    );

    const skip = Number(offset || 0);
    const limitEscaped = Number(limit || 0);
    const criteria = criteriaAnd.length
      ? { $and: criteriaAnd }
      : {};

    if (countOnly) {
      const count = await Team(
        options.database,
      ).countDocuments(criteria);
      return { count };
    }

    let rows: TeamDocument[] = await Team(options.database)
      .find(criteria)
      .skip(skip)
      .limit(limitEscaped)
      .sort(sort)
      .populate('members.member teamAdmin owner');

    const count = await Team(
      options.database,
    ).countDocuments(criteria);

    const teamRows: Array<ITeam | undefined> = rows.map(
      (row) => (row.toObject ? row.toObject() : row),
    );

    return { rows: teamRows, count };
  }

  static async findAllAutocomplete(
    search: string,
    limit: number,
    options: IRepositoryOptions,
  ): Promise<Array<{ id: any; label: any }>> {
    let criteriaAnd: Array<any> = [];

    if (search) {
      criteriaAnd.push({
        $or: [
          {
            _id: MongooseQueryUtils.uuid(
              new mongoose.Types.ObjectId(search),
            ),
          },
          {
            name: {
              $regex:
                MongooseQueryUtils.escapeRegExp(search),
              $options: 'i',
            },
          },
        ],
      });
    }

    const sort = MongooseQueryUtils.sort('name_ASC');
    const limitEscaped = Number(limit || 0);

    const criteria = { $and: criteriaAnd };
    const records = await Team(options.database)
      .find(criteria)
      .limit(limitEscaped)
      .sort(sort);

    return records.map((record: TeamDocument) => ({
      id: record.id,
      label: record.name,
    }));
  }

  static async addMembers(
    teamId: string,
    memberIds: string[],
    options: IRepositoryOptions,
  ) {
    const team = await this.findById(teamId, options);

    if (!team) {
      throw new Error404();
    }

    const members = memberIds.map((memberId) => ({
      member: memberId,
    }));

    await MongooseRepository.wrapWithSessionIfExists(
      Team(options.database).updateOne(
        { _id: teamId },
        { $addToSet: { members: { $each: members } } },
      ),
      options,
    );

    return this.findById(teamId, options);
  }

  static async removeMembers(
    teamId: string,
    memberIds: string[],
    options: IRepositoryOptions,
  ) {
    const team = await this.findById(teamId, options);

    if (!team) {
      throw new Error404();
    }

    await MongooseRepository.wrapWithSessionIfExists(
      Team(options.database).updateOne(
        { _id: teamId },
        {
          $pull: {
            members: { member: { $in: memberIds } },
          },
        },
      ),
      options,
    );

    return this.findById(teamId, options);
  }

  static async updateInvitationStatus(
    teamId: string,
    memberId: string,
    status: string,
    options: IRepositoryOptions,
  ) {
    const team = await this.findById(teamId, options);

    if (!team) {
      throw new Error404();
    }
    const memberExists = team.members.find(
      (m) => m._id?.toString() === memberId,
    );
    if (!memberExists) {
      throw new Error404();
    }
    await MongooseRepository.wrapWithSessionIfExists(
      Team(options.database).updateOne(
        { _id: teamId, 'members._id': memberId },
        {
          $set: {
            'members.$.status': status,
          },
        },
        { runValidators: true },
      ),
      options,
    );

    return this.findById(teamId, options);
  }
}

export default TeamRepository;
