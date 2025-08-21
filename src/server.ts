/**
 * Starts the application on the port specified.
 */
require('dotenv').config();

import api from './api';
import { IEnvVariables } from './IEnvVariables';

const envVar = process.env as IEnvVariables;
const PORT = envVar.PORT || 8080;

api.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
