import archiver from 'archiver';
import { rateLimit } from 'express-rate-limit';
import { createWriteStream, existsSync } from 'fs';
import { mkdir } from 'fs/promises';
import moment from 'moment-timezone';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import logService from '../services/log.service';
import constantUtil from './constant.util';

let instance;

class Util {
  getDateNow() {
    const dateNow = moment().tz(constantUtil.MomentTimeZone).format(constantUtil.MomentDateFormat);

    return dateNow;
  }

  getNewCodeEvent() {
    return uuidv4();
  }

  getRequestData(req) {
    return {
      headers: req.headers,
      body: req.body,
      method: req.method,
      params: req.params,
      query: req.query,
      url: req.url,
    };
  }

  async createZip(fileData, fileNameCompress, fileNameZip) {
    const returnMethod = {
      nm_method: 'createZip',
      dt_start: this.getDateNow(),
      dt_finish: null,
      was_error: null,
      response: null,
      info: [],
      methods: [],
      messages: [],
    };

    const levelCompress = +process.env.LEVEL_COMPRESS_FILE || 5;

    returnMethod.info.push(`info: levelCompress = ${levelCompress}`);
    returnMethod.info.push(`info: fileNameCompress = ${fileNameCompress}`);
    returnMethod.info.push(`info: fileNameZip = ${fileNameZip}`);
    returnMethod.info.push('info: fileData = OK');

    try {
      const targetDirectory = path.join(__dirname, '..', 'assets', 'temp');
      returnMethod.info.push(`info: targetDirectory = ${targetDirectory}`);

      if (!existsSync(targetDirectory)) {
        returnMethod.info.push('info: targetDirectory not found');
        await mkdir(targetDirectory);
      }

      const filePath = path.join(targetDirectory, fileNameZip);
      returnMethod.info.push(`info: filePath = ${filePath}`);

      const output = createWriteStream(filePath);
      const archive = archiver('zip', { zlib: { level: levelCompress } });

      archive.pipe(output);
      archive.append(fileData, { name: fileNameCompress });
      archive.finalize();

      // Aguarda até que o processo de escrita seja concluído
      await new Promise((resolve, reject) => {
        output.on('close', resolve);
        output.on('end', resolve);
        output.on('error', reject);
      });

      returnMethod.response = filePath;
    } catch (error) {
      await logService.error({ method: returnMethod.nm_method, error });
      returnMethod.info.push(`Error message: ${error.message}`);
      returnMethod.messages.push(constantUtil.MsgErrorCreateZip);
      returnMethod.was_error = true;
      returnMethod.response = null;
    }

    if (!returnMethod.response) {
      logService.info(JSON.stringify(returnMethod));
    }

    returnMethod.dt_finish = this.getDateNow();
    return returnMethod;
  }

  rateLimitAPI(qtMaxRate) {
    const qtMaxRateDef = process.env.QT_MAX_RATE_MINUTE || 180;

    qtMaxRate = !qtMaxRate ? qtMaxRateDef : +qtMaxRate;

    return rateLimit({
      windowMs: 1 * 60 * 1000, // 1 Minute
      max: qtMaxRate,
      statusCode: 429,
      message: constantUtil.MsgStatus429,
    });
  }

  static getInstance() {
    if (!instance) {
      instance = new Util();
      Object.freeze(instance);
    }
    return instance;
  }
}

export default Util.getInstance();
