/* eslint-disable no-console */
const fs = require('fs').promises;
const { default: utils } = require('../app/utils');
const { targetTestDbPath, testDbFileName } = require('./testUtil');

module.exports = async () => {
  // Faz isso para encerrar o express no final dos testes
  await global.server.close();

  // Apaga os arquivos zips que foram criados durante os testes
  await utils.deleteOldZip();

  try {
    // Aguarda 2 segundos para remover o db de testes
    setTimeout(() => {
      fs.unlink(targetTestDbPath);
      console.log(`file ${testDbFileName} has been deleted`);
    }, 2000);
  } catch (err) {
    console.error(err);
  }
};
