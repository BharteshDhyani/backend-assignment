import Error400 from '../errors/Error400';
import MongooseRepository from '../database/repositories/mongooseRepository';
import { IServiceOptions } from './IServiceOptions';
import TemplateRepository from '../database/repositories/templateRepository';
import CustomError from '../errors/CustomError';
import { TemplateDTO } from '../shared/dto/TemplateDTO';

export default class TemplateService {
  options: IServiceOptions;

  constructor(options: IServiceOptions) {
    this.options = options;
  }

  async create(data: TemplateDTO) {
    const session = await MongooseRepository.createSession(
      this.options.database,
    );

    try {
      const record = await TemplateRepository.create(data, {
        ...this.options,
        session,
      });

      await MongooseRepository.commitTransaction(session);

      return record;
    } catch (error) {
      await MongooseRepository.abortTransaction(session);

      MongooseRepository.handleUniqueFieldError(
        error as CustomError,
        this.options.language,
        'template',
      );

      throw error;
    }
  }

  async update(id: string, data: TemplateDTO) {
    const session = await MongooseRepository.createSession(
      this.options.database,
    );

    try {
      const record = await TemplateRepository.update(
        id,
        data,
        {
          ...this.options,
          session,
        },
      );

      await MongooseRepository.commitTransaction(session);

      return record;
    } catch (error) {
      await MongooseRepository.abortTransaction(session);

      MongooseRepository.handleUniqueFieldError(
        error as CustomError,
        this.options.language,
        'template',
      );

      throw error;
    }
  }

  async accessAll(ids: string[]) {
    const session = await MongooseRepository.createSession(this.options.database);
    try {
      for (const id of ids) {
        await TemplateRepository.access(id, {
          ...this.options,
          session
        })
      }
      await MongooseRepository.commitTransaction(session);
    } catch (error) {
      await MongooseRepository.abortTransaction(session);
      throw error;
    }
  }

  async destroyAll(ids: string[]) {
    const session = await MongooseRepository.createSession(
      this.options.database,
    );

    try {
      for (const id of ids) {
        await TemplateRepository.destroy(id, {
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
    return TemplateRepository.findById(id, this.options);
  }

  async findAllAutocomplete(search: string, limit: number) {
    return TemplateRepository.findAllAutocomplete(
      search,
      limit,
      this.options,
    );
  }

  async findAndCountAll(args: any) {
    return TemplateRepository.findAndCountAll(
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
    const count = await TemplateRepository.count(
      {
        importHash,
      },
      this.options,
    );

    return count > 0;
  }
}
