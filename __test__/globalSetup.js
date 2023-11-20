/* eslint-disable no-console */
const fs = require('fs');
const { default: app } = require('../app/app');
const { sourceTestDbPath, targetTestDbPath } = require('./testUtil');
const { default: constantUtil } = require('../app/utils/constant.util');

module.exports = async () => {
  // Configurar a variável de ambiente NODE_ENV para 'test' no início dos testes
  process.env.NODE_ENV = 'test';

  // Copia o banco de dados de testes para ser usado na aplicação
  fs.copyFileSync(sourceTestDbPath, targetTestDbPath);

  // Inicia o app
  app.start();

  // Salva o resultado do server.listen em uma var para usar depois
  // em outros pontos dos testes automatizados
  global.server = app.server.listen(constantUtil.NuPort, () => {
    console.log(constantUtil.MsgStartAPI);
  });
};
