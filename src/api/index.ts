import express, { Request, Response } from 'express';
import cors from 'cors';
import correlator from 'express-correlation-id';
import { databaseMiddleware } from '../middlewares/databaseMiddleware';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import { languageMiddleware } from '../middlewares/languageMiddleware';
import setupSwaggerUI from './apiDocumentation';
import template from './template';
import team from './team';

const app = express();
app.set('query parser', 'extended');
app.use(correlator());

// Enables CORS
app.use(cors({ origin: true }));

// Initializes and adds the database middleware.
app.use(databaseMiddleware);

// Sets the current language of the request
app.use(languageMiddleware);

// Parses the body of POST/PUT request
// to JSON
app.use(
  bodyParser.json({
    verify: function (
      req: Request,
      _res: Response,
      buf: Buffer<ArrayBufferLike>,
    ) {
      const url = (<any>req).originalUrl;
      if (url.startsWith('/api/plan/stripe/webhook')) {
        // Stripe Webhook needs the body raw in order
        // to validate the request
        (<any>req).rawBody = buf.toString();
      }
    },
  }),
);

// Setup the Documentation
setupSwaggerUI(app);

// Enables Helmet, a set of tools to
// increase security.
app.use(helmet());

// Configure the Entity routes
const routes = express.Router();
template(routes);
team(routes);

// Add the routes to the /api endpoint
app.use('/api', routes);

export default app;
