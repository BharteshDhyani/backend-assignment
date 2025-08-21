import MongooseRepository from '../database/repositories/mongooseRepository';
import { IServiceOptions } from './IServiceOptions';
import TeamRepository from '../database/repositories/teamRepository';
import CustomError from '../errors/CustomError';
import Error400 from '../errors/Error400';
import { TeamDTO } from '../shared/dto/TeamDTO';

export default class TeamService {
  options: IServiceOptions;

  constructor(options: IServiceOptions) {
    this.options = options;
  }

  async create(data: TeamDTO) {
    const session = await MongooseRepository.createSession(
      this.options.database,
    );

    try {
      const record = await TeamRepository.create(data, {
        ...this.options,
        session,
      });

      await MongooseRepository.commitTransaction(session);

      return record;
    } catch (error) {
      await MongooseRepository.abortTransaction(session);
      console.error('Error in TeamService.create:', error); 

      MongooseRepository.handleUniqueFieldError(
        error as CustomError,
        this.options.language,
        'team',
      );

      throw error;
    }
  }

  async update(id: string, data: TeamDTO) {
    const session = await MongooseRepository.createSession(
      this.options.database,
    );

    try {
      const record = await TeamRepository.update(id, data, {
        ...this.options,
        session,
      });

      await MongooseRepository.commitTransaction(session);

      return record;
    } catch (error) {
      await MongooseRepository.abortTransaction(session);
      console.error('Error in TeamService.create:', error);

      MongooseRepository.handleUniqueFieldError(
        error as CustomError,
        this.options.language,
        'team',
      );

      throw error;
    }
  }

  async destroyAll(ids: string[]) {
    const session = await MongooseRepository.createSession(
      this.options.database,
    );

    try {
      for (const id of ids) {
        await TeamRepository.destroy(id, {
          ...this.options,
          session,
        });
      }

      await MongooseRepository.commitTransaction(session);
    } catch (error) {
      await MongooseRepository.abortTransaction(session);
      throw error;
    }
  }

  async findById(id: string) {
    return TeamRepository.findById(id, this.options);
  }

  async findAndCountAll(args: any) {
    return TeamRepository.findAndCountAll(
      args,
      this.options,
    );
  }

  async import(data: any, importHash: string) {
    if (!importHash) {
      throw new Error400(
        this.options.language,
        'importer.errors.importHashRequired',
      );
    }

    if (await this._isImportHashExistent(importHash)) {
      throw new Error400(
        this.options.language,
        'importer.errors.importHashExistent',
      );
    }

    const dataToCreate = {
      ...data,
      importHash,
    };

    return this.create(dataToCreate);
  }

  async _isImportHashExistent(importHash: string) {
    const count = await TeamRepository.count(
      {
        importHash,
      },
      this.options,
    );

    return count > 0;
  }

  async addMembers(teamId: string, memberIds: string[]) {
    const session = await MongooseRepository.createSession(
      this.options.database,
    );

    try {
      const record = await TeamRepository.addMembers(
        teamId,
        memberIds,
        {
          ...this.options,
          session,
        },
      );

      await MongooseRepository.commitTransaction(session);

      return record;
    } catch (error) {
      await MongooseRepository.abortTransaction(session);
      throw error;
    }
  }

  async removeMembers(teamId: string, memberIds: string[]) {
    const session = await MongooseRepository.createSession(
      this.options.database,
    );

    try {
      const record = await TeamRepository.removeMembers(
        teamId,
        memberIds,
        {
          ...this.options,
          session,
        },
      );

      await MongooseRepository.commitTransaction(session);

      return record;
    } catch (error) {
      await MongooseRepository.abortTransaction(session);
      throw error;
    }
  }

  async updateInvitationStatus(
    teamId: string,
    memberId: string,
    status: string,
  ) {
    const session = await MongooseRepository.createSession(
      this.options.database,
    );

    try {
      const record =
        await TeamRepository.updateInvitationStatus(
          teamId,
          memberId,
          status,
          {
            ...this.options,
            session,
          },
        );

      await MongooseRepository.commitTransaction(session);

      return record;
    } catch (error) {
      await MongooseRepository.abortTransaction(session);
      throw error;
    }
  }

  async count(filter: any) {
    return TeamRepository.count(filter, this.options);
  }

  async findAllAutocomplete(search: string, limit: number) {
    return TeamRepository.findAllAutocomplete(
      search,
      limit,
      this.options,
    );
  }
}
