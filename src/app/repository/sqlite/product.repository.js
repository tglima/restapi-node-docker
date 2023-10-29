import { DataTypes } from 'sequelize';
import logService from '../../services/log.service';
import constantUtil from '../../utils/constant.util';
import dbUtil from '../../utils/db.util';
import util from '../../utils/util';

class ProductRepository {
  constructor() {
    this.#dbUtil = dbUtil;
    this.#defineProduct();
  }

  #productDB;

  #dbUtil;

  #defineProduct() {
    this.#productDB = this.#dbUtil.SQLite.define(
      'product',
      {
        id_product: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        nm_product: {
          type: DataTypes.STRING,
        },
        vl_month_price: {
          type: DataTypes.FLOAT,
        },
        nm_videoQuality: {
          type: DataTypes.STRING,
        },
        nm_resolution: {
          type: DataTypes.STRING,
        },
        qt_simultaneous_screens: {
          type: DataTypes.INTEGER,
        },
      },
      {
        tableName: 'product',
        timestamps: false,
      }
    );
  }

  async getAllProducts() {
    const returnMethod = {};
    returnMethod.nm_method = 'getAllProducts';
    returnMethod.dt_start = util.getDateNow();
    returnMethod.dt_finish = null;
    returnMethod.was_error = false;
    returnMethod.response = null;
    returnMethod.info = [];

    try {
      const products = await this.#productDB.findAll();
      returnMethod.response = !products ? null : products;
    } catch (error) {
      logService.info(`Error message: ${error.message}`);
      await logService.error({ method: returnMethod.nm_method, error });
      returnMethod.info.push(`Error message: ${error.message}`);
      returnMethod.was_error = true;
      returnMethod.response = null;

      //
      returnMethod.error = error;
      returnMethod.error_message = error.message;
    }

    returnMethod.dt_finish = util.getDateNow();
    return returnMethod;
  }

  async getProductById(id) {
    const returnMethod = {};
    returnMethod.nm_method = 'getProductById';
    returnMethod.dt_start = util.getDateNow();
    returnMethod.dt_finish = null;
    returnMethod.was_error = false;
    returnMethod.info = [{ id }];
    returnMethod.response = null;
    returnMethod.info = [];

    try {
      const product = await this.#productDB.findByPk(id);
      returnMethod.response = !product ? null : product;
    } catch (error) {
      logService.info(`Error message: ${error.message}`);
      await logService.error({ method: returnMethod.nm_method, error });
      returnMethod.info.push(`Error message: ${error.message}`);
      returnMethod.was_error = true;
      returnMethod.response = null;

      //
      returnMethod.error = error;
      returnMethod.error_message = error.message;
    }

    returnMethod.dt_finish = util.getDateNow();
    return returnMethod;
  }

  async countProduct() {
    const returnMethod = {
      nm_method: 'countProduct',
      dt_start: util.getDateNow(),
      dt_finish: null,
      was_error: null,
      response: null,
      info: [],
      methods: [],
      messages: [],
    };

    try {
      const qtItems = await this.#productDB.count();
      returnMethod.info.push(`info: qtItems = ${qtItems}`);
      returnMethod.response = qtItems;
    } catch (error) {
      logService.info(`Error message: ${error.message}`);
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

export default new ProductRepository();
