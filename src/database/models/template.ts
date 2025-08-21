import mongoose, { Mongoose, Document } from 'mongoose';
import { ITemplate } from '../../shared/interfaces/template/ITemplate';

export type TemplateDocument = Document &
  Omit<ITemplate, 'id'>;

const Schema = mongoose.Schema;

export default (
  database: Mongoose,
): mongoose.Model<TemplateDocument> => {
  try {
    return database.model<TemplateDocument>('template');
  } catch (error) {
    // continue, because model doesnt exist
  }

  const TemplateSchema = new Schema<TemplateDocument>(
    {
      name: {
        type: String,
      },
      content: {
        type: String,
      },
      tags: [
        {
          type: Schema.Types.String,
        },
      ],
      createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'user',
      },
      updatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'user',
      },
      importHash: { type: String },
    },
    { timestamps: true },
  );

  TemplateSchema.index(
    { importHash: 1 },
    {
      unique: true,
      partialFilterExpression: {
        importHash: { $type: 'string' },
      },
    },
  );

  TemplateSchema.index(
    { name: 1 },
    {
      unique: true,
      partialFilterExpression: {
        name: { $type: 'string' },
      },
    },
  );

  TemplateSchema.virtual('id').get(function () {
    // @ts-ignore
    return this._id.toHexString();
  });

  TemplateSchema.set('toJSON', {
    getters: true,
  });

  TemplateSchema.set('toObject', {
    getters: true,
  });

  return database.model<TemplateDocument>(
    'template',
    TemplateSchema,
  );
};
