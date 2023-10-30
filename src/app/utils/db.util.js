import { stat } from 'fs/promises';
import util from '.';
import logService from '../services/log.service';
import constantUtil from './constant.util';

const { Sequelize } = require('sequelize');
const path = require('path');

let instance;

class DbUtil {
  constructor() {
    this.DataBaseFileName = process.env.DATABASE_FILE_NAME || 'database.db';
    this.#dbPathSQLite = path.join(__dirname, '..', 'assets', this.DataBaseFileName);

    this.SQLite = new Sequelize({
      dialect: 'sqlite',
      storage: this.#dbPathSQLite,
      logging: false,
    });
  }

  #dbPathSQLite;

  async getTableNames() {
    const returnMethod = {
      nm_method: 'getTableNames',
      dt_start: util.getDateNow(),
      dt_finish: null,
      was_error: null,
      response: null,
      info: [],
      methods: [],
      messages: [],
    };

    try {
      const tableNames = await this.SQLite.getQueryInterface().showAllTables();
      returnMethod.info.push(`info: tableNames = ${JSON.stringify(tableNames)}`);
      returnMethod.response = tableNames;
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

  async getDataBaseSize() {
    const returnMethod = {
      nm_method: 'getDataBaseSize',
      dt_start: util.getDateNow(),
      dt_finish: null,
      was_error: null,
      response: null,
      info: [],
      methods: [],
      messages: [],
    };

    try {
      const stats = await stat(this.#dbPathSQLite);
      const fileSizeInBytes = stats.size;
      const fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024); // Tamanho em megabytes
      returnMethod.info.push(`info: fileSizeInMegabytes = ${fileSizeInMegabytes}`);
      returnMethod.response = fileSizeInMegabytes;
    } catch (error) {
      logService.info(`Error message: ${error.message}`);
      await logService.error({ method: returnMethod.nm_method, error });
      returnMethod.info.push(`Error message: ${error.message}`);
      returnMethod.messages.push(constantUtil.MsgErrorGetInfoFile);
      returnMethod.was_error = true;
      returnMethod.response = null;
    }

    returnMethod.dt_finish = util.getDateNow();
    return returnMethod;
  }

  static getInstance() {
    if (!instance) {
      instance = new DbUtil();
      Object.freeze(instance);
    }
    return instance;
  }
}

export default DbUtil.getInstance();
