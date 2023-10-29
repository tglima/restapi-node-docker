const { Sequelize } = require('sequelize');
const path = require('path');

let instance;

class DbUtil {
  constructor() {
    this.DataBaseFileName = process.env.DATABASE_FILE_NAME || 'database.db';

    const dbPathSqLite = path.join(__dirname, '..', 'assets', this.DataBaseFileName);
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
