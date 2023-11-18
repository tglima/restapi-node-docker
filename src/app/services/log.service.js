import winston from 'winston';
import constantUtil from '../utils/constant.util';

const logRepository = require('../repository/log.repository');

let instance;

class LogService {
  constructor() {
    this.#logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
      transports: [new winston.transports.Console()],
    });
  }

  #logger;

  info(message) {
    if (constantUtil.MustShowInfoMessage) {
      this.#logger.info(message);
    }
  }

  async error({ method, error }) {
    this.#logger.error(error.message);
    const logError = { method, error };

    // Feito assim por causa do import que foi adaptado
    // para evitar erro de dependências cíclicas
    await logRepository.default.saveLogError(logError);
  }

  static getInstance() {
    if (!instance) {
      instance = new LogService();
      Object.freeze(instance);
    }
    return instance;
  }
}

export default LogService.getInstance();
