/* eslint-disable no-console */
import express from 'express';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import morganBody from 'morgan-body';
import Youch from 'youch';
import routes from './routes';
import authServices from './services/auth.services';

const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 120,
  statusCode: 429,
  message: 'Limite de requisições ultrapassado, por favor, aguarde.',
});

class App {
  constructor() {
    this.server = express();
    this.port = process.env.NU_PORT;
    this.middlewares();
    this.loadRoutes();
    this.exceptionHandler();
  }

  start() {
    process.env.SWAGGER_URL = process.env.SWAGGER_URL.replace(
      '{{NU_PORT}}',
      process.env.NU_PORT
    );
    this.server.listen(this.port, () => {
      console.log(
        `API listening on ${process.env.NU_PORT}\nSwagger link: ${process.env.SWAGGER_URL}`
      );
    });
  }

  middlewares() {
    this.server.use(express.json());
    this.server.use(helmet());
    this.server.use('/', apiLimiter);
    this.server.use(authServices.checkAuth);
    if (process.env.MUST_RUN_MORGAN_BODY) {
      morganBody(this.server);
    }
  }

  loadRoutes() {
    this.server.use(routes);
  }

  exceptionHandler() {
    this.server.use(async (err, request, response, next) => {
      const errors = await new Youch(err, request).toJSON();
      return response.status(500).json(errors);
    });
  }
}

export default new App();
