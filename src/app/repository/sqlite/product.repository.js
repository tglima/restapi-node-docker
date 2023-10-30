import { DataTypes } from 'sequelize';
import logService from '../../services/log.service';
import util from '../../utils';
import constantUtil from '../../utils/constant.util';
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

  async findAll() {
    const returnMethod = util.getReturnMethod('findAll');

    try {
      const resultDB = await this.#productDB.findAll();
      let products;

      if (resultDB) {
        returnMethod.info.push(`info: qtdItems = ${resultDB.length}`);
        products = {
          products: resultDB.map((product) => product.toJSON()),
        };
      } else {
        returnMethod.messages.push(constantUtil.MsgStatus404);
      }

      returnMethod.response = products;
    } catch (error) {
      await logService.error({ method: returnMethod.nm_method, error });
      returnMethod.messages.push(constantUtil.MsgStatus500);
      returnMethod.info.push(`Error message: ${error.message}`);
      returnMethod.was_error = true;
      returnMethod.response = null;
    }

    returnMethod.dt_finish = util.getDateNow();
    return returnMethod;
  }

  async findById(id) {
    const returnMethod = util.getReturnMethod('findById');

    returnMethod.info.push(`info: id = ${id}`);

    try {
      const resultDB = await this.#productDB.findByPk(id);
      const product = !resultDB ? null : resultDB.toJSON();
      returnMethod.info.push(`info: product = ${product}`);
      returnMethod.response = product;
    } catch (error) {
      await logService.error({ method: returnMethod.nm_method, error });
      returnMethod.messages.push(constantUtil.MsgStatus500);
      returnMethod.info.push(`Error message: ${error.message}`);
      returnMethod.was_error = true;
      returnMethod.response = null;
    }

    returnMethod.dt_finish = util.getDateNow();
    return returnMethod;
  }

  async countProduct() {
    const returnMethod = util.getReturnMethod('countProduct');

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
