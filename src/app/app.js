import express from 'express';
import 'express-async-errors';
import helmet from 'helmet';
import morganBody from 'morgan-body';
import Youch from 'youch';
import Routes from './routes/index.routes';
import authServices from './services/auth.services';
import logService from './services/log.service';
import constantUtil from './utils/constant.util';
import dbUtil from './utils/db.util';

class App {
  constructor() {
    this.server = express();
    this.#port = process.env.NU_PORT;
    this.#routes = Routes;
    this.#routes.setupRoutes(this.server);
    this.#middlewares();
  }

  #routes;

  #port;

  start() {
    dbUtil.SQLite.authenticate()
      .then(() => {
        this.server.listen(this.#port, () => {
          logService.info(constantUtil.MsgStartAPI);
        });
      })
      .catch((error) => {
        logService.info(`Error message: ${error.message}`);
        logService.error({ method: 'start', error }).then(() => {
          return error;
        });
      });
  }

  #middlewares() {
    this.server.use(express.json());
    this.server.use(helmet());
    this.server.use(authServices.checkAuth);
    if (process.env.MUST_RUN_MORGAN_BODY) {
      morganBody(this.server);
    }
    this.#exceptionHandler();
  }

  #exceptionHandler() {
    this.server.use(async (err, request, response, next) => {
      const errors = await new Youch(err, request).toJSON();
      logService.info(errors);
      logService.error({ method: 'exceptionHandler', error: err }).then(() => {
        return response.status(500).json({ messages: [constantUtil.MsgStatus500] });
      });
    });
  }
}

export default new App();
