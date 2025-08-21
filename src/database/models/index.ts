import { Mongoose } from 'mongoose';

const models = [
  require('./template').default,
  require('./team').default,
];

export default function init(database: Mongoose) {
  for (let model of models) {
    model(database);
  }

  return database;
}

export async function createCollections(
  database: Mongoose,
) {
  for (let model of models) {
    await model(database).createCollection();
  }

  return database;
}
