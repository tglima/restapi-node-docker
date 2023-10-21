import winston from 'winston';

let instance;

class LogService {
  constructor() {
    this.#logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
      transports: [new winston.transports.Console()],
    });
  }

  #logger;

  info(message) {
    this.#logger.info(message);
  }

  error(message) {
    this.#logger.error(message);
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
