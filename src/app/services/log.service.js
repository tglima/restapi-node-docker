import winston from 'winston';

const logRepository = require('../repository/sqlite/log.repository');

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
    this.#logger.info(message);
  }

  async error(method, error) {
    this.#logger.error(error.message);
    await logRepository.saveLogError({ method, error });
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
