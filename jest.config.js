const dotenv = require('dotenv');

dotenv.config({ path: './app/config/test.env' });

module.exports = {
  // Diretórios onde os testes são procurados
  testMatch: ['**/__test__/integration/**/*.test.js', '**/__test__/unit/**/*.test.js'],

  // Configuração para o ambiente Node.js
  testEnvironment: 'node',

  // Módulo de cobertura de código
  collectCoverage: false,

  // Ignora arquivos que estão dentro do diretório node_modules.
  testPathIgnorePatterns: ['<rootDir>/node_modules/'],
  coveragePathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/__test__/'],

  // Configura as extensões de arquivo que o Jest deve processar durante a execução dos testes.
  moduleFileExtensions: ['js', 'json'],

  clearMocks: true,

  // Configura o jest para utilizar o babel-jest e considerar os imports e classes.
  transform: {
    '^.+\\.js$': 'babel-jest',
  },

  // Define o tempo máximo de timeout para cada teste para 30 segundos.
  testTimeout: 30000,

  globalSetup: './__test__/globalSetup.js',
  globalTeardown: './__test__/globalTeardown.js',
};
