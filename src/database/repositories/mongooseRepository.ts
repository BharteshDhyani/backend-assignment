import { getConfig } from '../../config';
import CustomError from '../../errors/CustomError';
import Error400 from '../../errors/Error400';
import { IRepositoryOptions } from './IRepositoryOptions';
import mongoose from 'mongoose';

/**
 * Abstracts some basic Mongoose operations.
 * See https://mongoosejs.com/docs/index.html
 */
export default class MongooseRepository {
  /**
   * Returns the currentUser if it exists on the options.
   */
  static getCurrentUser(options: IRepositoryOptions) {
    return (options && options.currentUser) || { id: null };
  }

  /**
   * Returns the session if it exists on the options.
   */
  static getSession(options: IRepositoryOptions) {
    return (options && options.session) || undefined;
  }

  /**
   * Creates a database session and transaction.
   */
  static async createSession(
    connection: mongoose.Mongoose,
  ): Promise<mongoose.ClientSession | undefined> {
    if (getConfig().DATABASE_TRANSACTIONS !== 'true') {
      return;
    }

    const session = await connection.startSession();
    await session.startTransaction();
    return session;
  }

  /**
   * Commits a database transaction.
   */
  static async commitTransaction(
    session: mongoose.ClientSession | undefined,
  ) {
    if (getConfig().DATABASE_TRANSACTIONS !== 'true') {
      return;
    }
    if (!session) {
      await session!.commitTransaction();
      await session!.endSession();
    }
  }

  /**
   * Aborts a database transaction.
   */
  static async abortTransaction(
    session: mongoose.ClientSession | undefined,
  ) {
    if (getConfig().DATABASE_TRANSACTIONS !== 'true') {
      return;
    }
    if (!session) {
      await session!.abortTransaction();
      await session!.endSession();
    }
  }

  /**
   * Wraps the operation with the current session.
   */
  static async wrapWithSessionIfExists(
    toWrap: any,
    options: IRepositoryOptions,
  ) {
    if (!this.getSession(options)) {
      return toWrap;
    }

    return toWrap.session(this.getSession(options));
  }

  static handleUniqueFieldError(
    error: CustomError,
    language: string,
    entityName: string,
  ) {
    if (!error || error.code !== 11000) {
      return;
    }

    const uniqueFieldWithError = Object.keys(
      error.keyPattern!,
    )[0];

    throw new Error400(
      language,
      `entities.${entityName}.errors.unique.${uniqueFieldWithError}`,
    );
  }
}
