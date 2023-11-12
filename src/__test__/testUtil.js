const path = require('path');

const testDbFileName = 'test_database.db';
const sourceTestDbPath = path.resolve(__dirname, 'assets', testDbFileName);
const targetTestDbPath = path.resolve(__dirname, '..', 'app', 'assets', testDbFileName);

module.exports = { sourceTestDbPath, targetTestDbPath, testDbFileName };
