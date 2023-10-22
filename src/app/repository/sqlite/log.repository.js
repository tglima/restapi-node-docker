import { DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import logService from '../../services/log.service';
import dbUtil from '../../utils/db.util';
import util from '../../utils/util';

class LogRepository {
  constructor() {
    this.#dbUtil = dbUtil;
    this.#defineLogEvent();
    this.#defineLogError();
  }

  #dbUtil;

  #logEventDB;

  #logErrorDB;

  #defineLogEvent() {
    this.#logEventDB = this.#dbUtil.SQLite.define(
      'log_event',
      {
        id_log_event: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        code_event: {
          type: DataTypes.STRING,
        },
        dt_start: {
          type: DataTypes.STRING,
        },
        dt_finish: {
          type: DataTypes.STRING,
        },
        type_event: {
          type: DataTypes.STRING,
        },
        json_log_event: {
          type: DataTypes.STRING,
        },
      },
      {
        tableName: 'log_event',
        timestamps: false,
      }
    );

    this.#dbUtil.SQLite.sync();
  }

  #defineLogError() {
    this.#logErrorDB = this.#dbUtil.SQLite.define(
      'log_error',
      {
        id_log_error: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        dt_register: {
          type: DataTypes.STRING,
        },
        method: {
          type: DataTypes.STRING,
        },
        json_log_error: {
          type: DataTypes.STRING,
        },
      },
      {
        tableName: 'log_error',
        timestamps: false,
      }
    );
    this.#dbUtil.SQLite.sync();
  }

  saveLogError(logError) {
    try {
      const exception = {
        message: logError.error.message,
        stack_trace: logError.error.stack,
      };

      this.#logErrorDB.create({
        dt_register: util.getDateNow(),
        method: logError.method,
        json_log_error: exception,
      });
    } catch (error) {
      logService.error(error);
    }
  }

  saveLogEvent(logEvent) {
    const code_event = uuidv4();
    try {
      this.#logEventDB.create({
        code_event,
        dt_start: logEvent.dt_start,
        dt_finish: util.getDateNow(),
        type_event: logEvent.type_event,
        json_log_event: logEvent.json_log_event,
      });
    } catch (error) {
      logService.error(error);
      this.saveLogError(error);
    }

    return code_event;
  }
}

export const TypesEvent = Object.freeze({
  SERVICE: 'service',
  REQUEST: 'request',
});
export default new LogRepository();
