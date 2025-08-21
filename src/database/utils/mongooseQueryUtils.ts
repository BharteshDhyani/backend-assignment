import mongoose, { SortOrder } from 'mongoose';
/**
 * Utilities to use on Mongoose queries.
 */
export default class MongooseQueryUtils {
  /**
   * If you pass an invalid uuid to a query, it throws an exception.
   * To hack this behaviour, if the uuid is invalid, it creates a new one,
   * that won't match any of the database.
   * If the uuid is invalid, brings no results.
   */
  static uuid(
    value: mongoose.Types.ObjectId,
  ): mongoose.Types.ObjectId {
    let id = value;

    // If ID is invalid, mongodb throws an error.
    // For that not to happen, if the ObjectID is invalid, it sets
    // some random ObjectID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      id = mongoose.Types.ObjectId.createFromTime(
        +new Date(),
      );
    }

    return id;
  }

  static getObjectId(
    value: mongoose.Types.ObjectId | string,
  ): mongoose.Types.ObjectId {
    if (typeof value === 'string') {
      return new mongoose.Types.ObjectId(value);
    }
    return value;
  }

  static generateObjectId(
  ): mongoose.Types.ObjectId {
      return new mongoose.Types.ObjectId();
  }

  /**
   * Some string values may break the RegExp used for queries.
   * This method escapes it.
   */
  static escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Returns the sort clause.
   */
  static sort(
    orderBy?: string,
  ): { [x: string]: SortOrder } | undefined {
    if (!orderBy) {
      return undefined;
    }

    let [column, order] = orderBy.split('_');

    if (column === 'id') {
      column = '_id';
    }

    return {
      [column]: order === 'ASC' ? 1 : -1,
    };
  }
}
