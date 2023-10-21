const { Sequelize } = require('sequelize');
const path = require('path');

let instance;

class DbUtil {
  constructor() {
    const dbPathSqLite = path.join(__dirname, '..', 'assets', 'database.db');
    this.SQLite = new Sequelize({
      dialect: 'sqlite',
      storage: dbPathSqLite,
      logging: false,
    });
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
