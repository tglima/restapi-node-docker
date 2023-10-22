import express from 'express';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import morganBody from 'morgan-body';
import Youch from 'youch';
import logRepository from './repository/sqlite/log.repository';
import routes from './routes';
import authServices from './services/auth.services';
import logService from './services/log.service';
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
    this.#port = process.env.NU_PORT;
    this.#middlewares();
    this.#loadRoutes();
    this.#exceptionHandler();
  }

  #port;

  start() {
    dbUtil.SQLite.authenticate()
      .then(() => {
        this.server.listen(this.#port, () => {
          logService.info(constantUtil.MsgStartAPI);
        });
      })
      .catch((error) => {
        logService.error(constantUtil.MsgConnSQLiteError);
        logRepository.saveLogError({ method: 'start', error });
        return error;
      });
  }

  #middlewares() {
    this.server.use(express.json());
    this.server.use(helmet());
    this.server.use('/', apiLimiter);
    this.server.use(authServices.checkAuth);
    if (process.env.MUST_RUN_MORGAN_BODY) {
      morganBody(this.server);
    }
  }

  #loadRoutes() {
    this.server.use(routes);
  }

  #exceptionHandler() {
    this.server.use(async (err, request, response, next) => {
      const errors = await new Youch(err, request).toJSON();
      logService.error(errors);
      logRepository.saveLogError({ method: 'exceptionHandler', error: err });
      return response
        .status(500)
        .json({ messages: [constantUtil.MsgStatus500] });
    });
  }
}

export default new App();
