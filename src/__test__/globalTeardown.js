/* eslint-disable no-console */
const fs = require('fs').promises;
const { targetTestDbPath, testDbFileName } = require('./testUtil');

module.exports = async () => {
  // Faz isso para encerrar o express no final dos testes
  await global.server.close();

  try {
    // Aguarda 3 segundos para remover o db de testes
    setTimeout(() => {
      fs.unlink(targetTestDbPath);
      console.log(`file ${testDbFileName} has been deleted`);
    }, 3000);
  } catch (err) {
    console.error(err);
  }
};
