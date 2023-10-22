import { DataTypes } from 'sequelize';
import logService from '../../services/log.service';
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
    returnMethod.was_error = false;

    try {
      const products = await this.#productDB.findAll();
      returnMethod.response = !products ? null : products;
    } catch (error) {
      returnMethod.was_error = true;
      returnMethod.response = null;
      returnMethod.error = error;
      returnMethod.error_message = error.message;
      logService.error(error);
    }

    returnMethod.dt_finish = util.getDateNow();
    return returnMethod;
  }

  async getProductById(id) {
    const returnMethod = {};
    returnMethod.nm_method = 'getProductById';
    returnMethod.dt_start = util.getDateNow();
    returnMethod.was_error = false;
    returnMethod.info = [{ id }];

    try {
      const product = await this.#productDB.findByPk(id);
      returnMethod.response = !product ? null : product;
    } catch (error) {
      returnMethod.was_error = true;
      returnMethod.response = null;
      returnMethod.error = error;
      returnMethod.error_message = error.message;
      logService.error(error);
    }

    returnMethod.dt_finish = util.getDateNow();
    return returnMethod;
  }
}

export default new ProductRepository();
