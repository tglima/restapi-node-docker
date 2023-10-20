/* eslint-disable no-console */
import express from 'express';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import morganBody from 'morgan-body';
import Youch from 'youch';
import routes from './routes';
import authServices from './services/auth.services';
import constantUtil from './utils/constant.util';
import dbUtil from './utils/db.util';

const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 120,
  statusCode: 429,
  message: constantUtil.MsgStatus429,
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
    dbUtil.SQLite.authenticate()
      .then(() => {
        this.server.listen(this.port, () => {
          console.log(constantUtil.MsgStartAPI);
        });
      })
      .catch((error) => {
        console.error(constantUtil.MsgConnSQLiteError, error);
        return error;
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
