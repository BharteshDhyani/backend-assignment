import { Express } from 'express';
import swaggerUI from 'swagger-ui-express';
import { IEnvVariables } from '../IEnvVariables';
const swaggerDocument = require('../documentation/openapi.json');

export default function setupSwaggerUI(app: Express) {
  const envVar = process.env as IEnvVariables;
  if (String(envVar.API_DOCUMENTATION_ENABLED) !== 'true') {
    return;
  }
  app.use(
    '/documentation',
    swaggerUI.serve,
    swaggerUI.setup(swaggerDocument),
  );
}
