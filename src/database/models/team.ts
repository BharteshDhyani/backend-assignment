import mongoose, { Mongoose, Document } from 'mongoose';
import { ITeam } from '../../shared/interfaces/team/ITeam';

export type TeamDocument = Document & Omit<ITeam, 'id'>;

const Schema = mongoose.Schema;

export default (
  database: Mongoose,
): mongoose.Model<TeamDocument> => {
  try {
    return database.model<TeamDocument>('team');
  } catch (error) {
    // continue, because model doesnt exist
  }

  const TeamSchema = new Schema<TeamDocument>(
    {
      name: {
        type: String,
        required: true,
      },
      teamAdmin: {
        type: String,
        required: true,
      },
      members: [
        {
          member: {
            type: String,
            required: true,
          },
          joined_on: Date,
          invited_at: Date,
          status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending',
          },
        },
      ],
      owner: {
        type: String,
        required: true,
      },
      createdBy: {
        type: String,
      },
      updatedBy: {
        type: String,
      },

      importHash: { type: String },
    },
    { timestamps: true },
  );

  TeamSchema.index(
    { importHash: 1 },
    {
      unique: true,
      partialFilterExpression: {
        importHash: { $type: 'string' },
      },
    },
  );

  TeamSchema.index(
    { name: 1 },
    {
      unique: true,
      partialFilterExpression: {
        name: { $type: 'string' },
      },
    },
  );

  TeamSchema.virtual('id').get(function () {
    // @ts-ignore
    return this._id.toHexString();
  });

  TeamSchema.set('toJSON', {
    getters: true,
  });

  TeamSchema.set('toObject', {
    getters: true,
  });

  return database.model<TeamDocument>('team', TeamSchema);
};
