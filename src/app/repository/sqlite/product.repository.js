/* eslint-disable no-console */
import { DataTypes } from 'sequelize';
import dbUtil from '../../utils/db.util';

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
    returnMethod.dt_start = new Date();
    returnMethod.was_error = false;

    try {
      const products = await this.#productDB.findAll();
      returnMethod.response = !products ? null : products;
    } catch (error) {
      returnMethod.was_error = true;
      returnMethod.response = null;
      returnMethod.error = error;
      returnMethod.error_message = error.message;
    }

    returnMethod.dt_finish = new Date();
    return returnMethod;
  }

  async getProductById(id) {
    const returnMethodDTO = {};
    returnMethodDTO.nm_method = 'getProductById';
    returnMethodDTO.dt_start = new Date();
    returnMethodDTO.was_error = false;
    returnMethodDTO.info = [{ id }];

    try {
      const product = await this.#productDB.findByPk(id);
      returnMethodDTO.response = !product ? null : product;
    } catch (error) {
      returnMethodDTO.was_error = true;
      returnMethodDTO.response = null;
      returnMethodDTO.error = error;
      returnMethodDTO.error_message = error.message;
    }

    returnMethodDTO.dt_finish = new Date();
    return returnMethodDTO;
  }
}

export default new ProductRepository();
