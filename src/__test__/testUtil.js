const path = require('path');
const { default: constantUtil } = require('../app/utils/constant.util');

const testDbFileName = 'test_database.db';
const sourceTestDbPath = path.resolve(__dirname, 'assets', testDbFileName);
const targetTestDbPath = path.resolve(__dirname, '..', 'app', 'assets', testDbFileName);

const apiKey = constantUtil.ApiKey;
const authorization = constantUtil.MngKeyAuth;
const urlDBDelete = `/v${constantUtil.NuVersionAPI}/mng/database/delete`;
const urlDBBackup = `/v${constantUtil.NuVersionAPI}/mng/database-backup`;
const urlDBInfo = `/v${constantUtil.NuVersionAPI}/mng/database-info`;
const urlLogErrors = `/v${constantUtil.NuVersionAPI}/mng/log-errors`;
const urlLogEvents = `/v${constantUtil.NuVersionAPI}/mng/log-events`;
const urlProductFind = `/v${constantUtil.NuVersionAPI}/products/find`;
const momentDateFormat = constantUtil.MomentDateFormat;

module.exports = {
  apiKey,
  authorization,
  momentDateFormat,
  urlDBDelete,
  urlDBBackup,
  urlDBInfo,
  urlLogErrors,
  urlLogEvents,
  urlProductFind,
  sourceTestDbPath,
  targetTestDbPath,
  testDbFileName,
};
