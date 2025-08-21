import MongooseRepository from './mongooseRepository';
import MongooseQueryUtils from '../utils/mongooseQueryUtils';
import Error404 from '../../errors/Error404';
import { IRepositoryOptions } from './IRepositoryOptions';
import lodash from 'lodash';
import Template from '../models/template';
import mongoose from 'mongoose';
import { ITemplate } from '../../shared/interfaces/template/ITemplate';
import { TemplateDocument } from '../models/template';
import { TemplateRequest } from '../../shared/type/template/TemplateRequest';
import { TemplateDTO } from '../../shared/dto/TemplateDTO';
class TemplateRepository {
  static async create(
    data: TemplateDTO,
    options: IRepositoryOptions,
  ): Promise<ITemplate> {
    const currentUser =
      MongooseRepository.getCurrentUser(options);

    const record: TemplateDocument =
      (await MongooseRepository.wrapWithSessionIfExists(
        Template(options.database).create({
          ...data,
          createdBy: currentUser.id,
          updatedBy: currentUser.id,
        }),
        options,
      )) as TemplateDocument;

    return this.findById(record.id, options);
  }

  static async update(
    id: string,
    data: TemplateDTO,
    options: IRepositoryOptions,
  ) {
    let record =
      await MongooseRepository.wrapWithSessionIfExists(
        Template(options.database).findOne({
          _id: id,
        }),
        options,
      );

    if (!record) {
      throw new Error404();
    }

    await MongooseRepository.wrapWithSessionIfExists(
      await Template(options.database).updateOne(
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

  static async access(
    id: string,
    options: IRepositoryOptions,
  ): Promise<void> {
    const currentUser =
      await MongooseRepository.getCurrentUser(options);
      await MongooseRepository.wrapWithSessionIfExists(
        Template(options.database).findOneAndUpdate(
          {
            createdBy: currentUser.id,
          },
          { $addToSet: { hasAccess: id } },
          { new: true },
        ),
        options,
      );
  }

  static async destroy(
    id: string,
    options: IRepositoryOptions,
  ): Promise<boolean> {
    let record =
      await MongooseRepository.wrapWithSessionIfExists(
        Template(options.database).findOne({
          _id: id,
        }),
        options,
      );

    if (!record) {
      throw new Error404();
    }

    await MongooseRepository.wrapWithSessionIfExists(
      await Template(options.database).deleteOne({
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

    const records = await Template(options.database)
      .find({
        _id: { $in: ids },
      })
      .select(['_id']);

    return records.map(
      (record) => record._id,
    ) as Array<string>;
  }

  static async count(
    filter: Partial<ITemplate>,
    options: IRepositoryOptions,
  ): Promise<number> {
    return MongooseRepository.wrapWithSessionIfExists(
      Template(options.database).countDocuments({
        ...filter,
      }),
      options,
    );
  }

  static async findById(
    id: string,
    options: IRepositoryOptions,
  ): Promise<ITemplate> {
    let record =
      await MongooseRepository.wrapWithSessionIfExists(
        Template(options.database)
          .findOne({
            _id: id,
          })
          .populate('tags'),
        options,
      );

    if (!record) {
      throw new Error404();
    }

    return this._mapRelationshipsAndFillDownloadUrl(record);
  }

  static async findAndCountAll(
    {
      filter,
      limit = 0,
      offset = 0,
      orderBy = '',
      countOnly = false,
    }: TemplateRequest,
    options: IRepositoryOptions,
  ): Promise<{
    count: number;
    rows?: Array<ITemplate | undefined>;
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
      const count = await Template(
        options.database,
      ).countDocuments(criteria);
      return { count };
    }

    let rows: TemplateDocument[] = await Template(
      options.database,
    )
      .find(criteria)
      .skip(skip)
      .limit(limitEscaped)
      .sort(sort);
    const count = await Template(
      options.database,
    ).countDocuments(criteria);

    const templateRows: Array<ITemplate | undefined> =
      await Promise.all<ITemplate | undefined>(
        rows.map(this._mapRelationshipsAndFillDownloadUrl),
      );

    return { rows: templateRows, count };
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
    const records = await Template(options.database)
      .find(criteria)
      .limit(limitEscaped)
      .sort(sort);

    return records.map((record: TemplateDocument) => ({
      id: record.id,
      label: record.name,
    }));
  }

  static async _mapRelationshipsAndFillDownloadUrl(
    record: TemplateDocument,
  ): Promise<ITemplate> {
    const output = record.toObject
      ? record.toObject()
      : record;

    return output;
  }
}

export default TemplateRepository;
