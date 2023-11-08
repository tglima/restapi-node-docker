import { stat } from 'fs/promises';
import util from '.';
import logService from '../services/log.service';
import constantUtil from './constant.util';

const { Sequelize } = require('sequelize');
const path = require('path');

let instance;

class DbUtil {
  constructor() {
    this.#dbPathSQLite = path.join(__dirname, '..', 'assets', constantUtil.DataBaseFileName);

    this.SQLite = new Sequelize({
      dialect: 'sqlite',
      storage: this.#dbPathSQLite,
      logging: false,
    });
  }

  #dbPathSQLite;

  async getTableNames() {
    const returnMethod = util.getReturnMethod('getTableNames');

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
    const returnMethod = util.getReturnMethod('getDataBaseSize');

    try {
      const stats = await stat(this.#dbPathSQLite);
      const fileSizeInBytes = stats.size;
      const fileSizeInMegabytes = (fileSizeInBytes / (1024 * 1024)).toFixed(2); // Tamanho em megabytes
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
