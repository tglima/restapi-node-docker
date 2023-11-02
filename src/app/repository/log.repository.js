import { DataTypes, Op, Sequelize, literal } from 'sequelize';
import logService from '../services/log.service';
import util from '../utils';
import constantUtil from '../utils/constant.util';
import dbUtil from '../utils/db.util';

function formatRowsJsonLogEvent(rows) {
  rows.forEach((item) => {
    item.json_log_event = JSON.parse(item.json_log_event, (key, value) => {
      if (Array.isArray(value) && value.length === 0) {
        return null;
      }
      return value;
    });
  });

  return rows;
}

function formartResultLogDB(logDB) {
  logDB = logDB.toJSON();
  const { json_log_event } = logDB;
  if (json_log_event) {
    logDB.json_log_event = JSON.parse(json_log_event, (key, value) => {
      if (Array.isArray(value) && value.length === 0) {
        return null;
      }
      return value;
    });
  }

  return logDB;
}

function formatMultiResultLogDB(resultDB, page, perPage) {
  const log_events = formatRowsJsonLogEvent(resultDB.rows);
  const jsonResult = {
    total_items: resultDB.count,
    total_pages: Math.ceil(resultDB.count / perPage),
    current_page: page,
    log_events,
  };
  return jsonResult;
}

class LogRepository {
  constructor() {
    this.#dbUtil = dbUtil;
    this.#defineLogEvent();
    this.#defineLogError();
    this.#qtLimitResult = +process.env.QT_LIMIT_RESULT || 10;
    this.#qtLimitDelete = +process.env.QT_LIMIT_DELETE || 10;
  }

  #dbUtil;

  #logEventDB;

  #logErrorDB;

  #qtLimitResult;

  #qtLimitDelete;

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
      const errorStackArray = logError.error.stack.split('\n').map((line) => line.trim());

      const json_log_error = JSON.stringify({
        name: logError.error.name,
        message: logError.error.message,
        stack: errorStackArray,
      });

      this.#logErrorDB.create({
        dt_register: util.getDateNow(),
        method: logError.method,
        json_log_error,
      });
    } catch (error) {
      logService.info(`Error message: ${error.message}`);
    }
  }

  saveLogEvent(logEvent) {
    if (!logEvent.code_event) {
      logEvent.code_event = util.getNewCodeEvent();
    }

    try {
      this.#logEventDB.create({
        code_event: logEvent.code_event,
        dt_start: logEvent.dt_start,
        dt_finish: util.getDateNow(),
        type_event: logEvent.type_event,
        json_log_event: JSON.stringify(logEvent.json_log_event),
      });
    } catch (error) {
      logService.info(`Error message: ${error.message}`);
      logService.error({ method: 'saveLogEvent', error });
    }

    return logEvent.code_event;
  }

  async findByDateRange(dt_start, dt_finish, page) {
    const returnMethod = util.getReturnMethod('findByDateRange');

    const offset = (page - 1) * this.#qtLimitResult;

    returnMethod.info.push(`info: dt_start = ${dt_start}`);
    returnMethod.info.push(`info: dt_finish = ${dt_finish}`);
    returnMethod.info.push(`info: page = ${page}`);
    returnMethod.info.push(`info: limit = ${this.#qtLimitResult}`);
    returnMethod.info.push(`info: offset = ${offset}`);

    try {
      const resultDB = await this.#logEventDB.findAndCountAll({
        where: {
          dt_start: { [Sequelize.Op.gte]: dt_start },
          dt_finish: { [Sequelize.Op.lte]: dt_finish },
        },
        offset,
        limit: this.#qtLimitResult,
      });

      // Feito desta forma resultDB.rows[0] visto que o count falhava as vezes
      if (resultDB.rows && resultDB.rows[0]) {
        returnMethod.response = formatMultiResultLogDB(resultDB, page, this.#qtLimitResult);
      }
    } catch (error) {
      await logService.error({ method: returnMethod.nm_method, error });
      returnMethod.messages.push(constantUtil.MsgErroDatabaseQuery);
      returnMethod.info.push(`Error message: ${error.message}`);
      returnMethod.was_error = true;
      returnMethod.response = null;
    }

    returnMethod.dt_finish = util.getDateNow();
    return returnMethod;
  }

  async findByApiKey(api_key, page) {
    const returnMethod = util.getReturnMethod('findByApiKey');

    const offset = (page - 1) * this.#qtLimitResult;

    const literalSubQuery = constantUtil.SQliteQueryFindByApiKey.replace('{{VALUE}}', api_key);

    returnMethod.info.push(`info: api_key = ${api_key}`);
    returnMethod.info.push(`info: page = ${page}`);
    returnMethod.info.push(`info: limit = ${this.#qtLimitResult}`);
    returnMethod.info.push(`info: offset = ${offset}`);
    returnMethod.info.push(`info: literalSubQuery = ${literalSubQuery}`);

    try {
      const resultDB = await this.#logEventDB.findAndCountAll({
        where: {
          [Op.and]: [{ type_event: 'request' }, literal(literalSubQuery)],
        },
        order: [['dt_start', 'DESC']],
        offset,
        limit: this.#qtLimitResult,
      });

      // Feito desta forma resultDB.rows[0] visto que o count falhava as vezes
      if (resultDB.rows && resultDB.rows[0]) {
        returnMethod.response = formatMultiResultLogDB(resultDB, page, this.#qtLimitResult);
      }
    } catch (error) {
      await logService.error({ method: returnMethod.nm_method, error });
      returnMethod.messages.push(constantUtil.MsgErroDatabaseQuery);
      returnMethod.info.push(`Error message: ${error.message}`);
      returnMethod.was_error = true;
      returnMethod.response = null;
    }

    returnMethod.dt_finish = util.getDateNow();
    return returnMethod;
  }

  async findByCodeEvent(codeEvent) {
    const returnMethod = util.getReturnMethod('findByCodeEvent');

    returnMethod.info.push(`info: codeEvent = ${codeEvent}`);

    try {
      const logDB = await this.#logEventDB.findOne({ where: { code_event: codeEvent } });
      returnMethod.response = !logDB ? null : formartResultLogDB(logDB);
    } catch (error) {
      await logService.error({ method: returnMethod.nm_method, error });
      returnMethod.messages.push(constantUtil.MsgErroDatabaseQuery);
      returnMethod.info.push(`Error message: ${error.message}`);
      returnMethod.was_error = true;
      returnMethod.response = null;
    }

    returnMethod.dt_finish = util.getDateNow();
    return returnMethod;
  }

  async countLogEvent() {
    const returnMethod = util.getReturnMethod('countLogEvent');

    try {
      const qtItems = await this.#logEventDB.count();
      returnMethod.info.push(`info: qtItems = ${qtItems}`);
      returnMethod.response = qtItems;
    } catch (error) {
      await logService.error({ method: returnMethod.nm_method, error });
      returnMethod.messages.push(constantUtil.MsgErroDatabaseQuery);
      returnMethod.info.push(`Error message: ${error.message}`);
      returnMethod.was_error = true;
      returnMethod.response = null;
    }

    returnMethod.dt_finish = util.getDateNow();
    return returnMethod;
  }

  async countLogError() {
    const returnMethod = util.getReturnMethod('countLogError');

    try {
      const qtItems = await this.#logErrorDB.count();
      returnMethod.info.push(`info: qtItems = ${qtItems}`);
      returnMethod.response = qtItems;
    } catch (error) {
      await logService.error({ method: returnMethod.nm_method, error });
      returnMethod.info.push(`Error message: ${error.message}`);
      returnMethod.messages.push(constantUtil.MsgErroDatabaseQuery);
      returnMethod.was_error = true;
      returnMethod.response = null;
    }

    returnMethod.dt_finish = util.getDateNow();
    return returnMethod;
  }

  async deleteLogError() {
    const returnMethod = util.getReturnMethod('deleteLogError');

    try {
      const rowsToDelete = await this.#logErrorDB.findAll({
        order: [['dt_register', 'ASC']],
        limit: this.#qtLimitDelete,
      });

      returnMethod.info.push(`info: rowsToDelete.length = ${rowsToDelete.length}`);

      if (rowsToDelete.length > 0) {
        const idsToDelete = rowsToDelete.map((row) => row.id_log_error);
        returnMethod.info.push(`info: idsToDelete = ${idsToDelete}`);

        await this.#logErrorDB.destroy({
          where: {
            id_log_error: {
              [Op.in]: idsToDelete,
            },
          },
        });

        const msgDeleteRows = constantUtil.MsgDatabaseDeleteRows.replace('{{VALUE}}', rowsToDelete.length);
        returnMethod.messages.push(msgDeleteRows);
      } else {
        returnMethod.info.push('info: No records to delete');
        returnMethod.messages.push(constantUtil.MsgDatabaseNoDelete);
      }

      returnMethod.response = true;
    } catch (error) {
      await logService.error({ method: returnMethod.nm_method, error });
      returnMethod.info.push(`Error message: ${error.message}`);
      returnMethod.messages.push(constantUtil.MsgErroDatabaseQuery);
      returnMethod.was_error = true;
      returnMethod.response = null;
    }

    returnMethod.dt_finish = util.getDateNow();
    return returnMethod;
  }

  async deleteLogEvent() {
    const returnMethod = util.getReturnMethod('deleteLogEvent');

    try {
      const rowsToDelete = await this.#logEventDB.findAll({
        order: [['dt_start', 'ASC']],
        limit: this.#qtLimitDelete,
      });

      // Feito assim, pois sempre teremos pelo menos 1 registro na tabela.
      if (rowsToDelete.length > 1) {
        const idsToDelete = rowsToDelete.map((row) => row.id_log_event);
        returnMethod.info.push(`info: idsToDelete = ${idsToDelete}`);

        await this.#logEventDB.destroy({
          where: {
            id_log_event: {
              [Op.in]: idsToDelete,
            },
          },
        });

        const msgDeleteRows = constantUtil.MsgDatabaseDeleteRows.replace('{{VALUE}}', rowsToDelete.length);
        returnMethod.messages.push(msgDeleteRows);
      } else {
        returnMethod.info.push('info: No records to delete');
        returnMethod.messages.push(constantUtil.MsgDatabaseNoDelete);
      }

      returnMethod.response = true;
    } catch (error) {
      await logService.error({ method: returnMethod.nm_method, error });
      returnMethod.info.push(`Error message: ${error.message}`);
      returnMethod.messages.push(constantUtil.MsgErroDatabaseQuery);
      returnMethod.was_error = true;
      returnMethod.response = null;
    }

    returnMethod.dt_finish = util.getDateNow();
    return returnMethod;
  }
}

export const TypesEvent = Object.freeze({
  SERVICE: 'service',
  REQUEST: 'request',
  METHOD: 'method',
});
export default new LogRepository();
