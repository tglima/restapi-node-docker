import archiver from 'archiver';
import { rateLimit } from 'express-rate-limit';
import { createWriteStream, existsSync, readdirSync, statSync, unlinkSync } from 'fs';
import { mkdir } from 'fs/promises';
import moment from 'moment-timezone';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import logService from '../services/log.service';
import constantUtil from './constant.util';

// Feito assim por causa do import que foi adaptado
// para evitar erro de dependências cíclicas
const logRepository = require('../repository/log.repository');

let instance;

function createFolderTemp() {
  const targetDirectory = path.join(__dirname, '..', 'assets', 'temp');
  if (!existsSync(targetDirectory)) {
    mkdir(targetDirectory);
  }
}

class Util {
  constructor() {
    createFolderTemp();
  }

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

  getReturnMethod(nm_method) {
    return {
      nm_method,
      dt_start: this.getDateNow(),
      dt_finish: null,
      was_error: null,
      response: null,
      info: [],
      methods: [],
      messages: [],
    };
  }

  getLogDTO(typeEvent, req) {
    const { TypesEvent } = logRepository;

    const io_data = {};
    let reqData;

    if (typeEvent === TypesEvent.REQUEST) {
      if (req) {
        reqData = this.getRequestData(req);
      }

      io_data.request_data = reqData;
      io_data.response_data = undefined;
    }

    const LogDTO = {
      code_event: this.getNewCodeEvent(),
      dt_start: this.getDateNow(),
      dt_finish: undefined,
      type_event: typeEvent,
      json_log_event: {
        io_data,
        methods: [],
        info: [],
      },
    };

    return LogDTO;
  }

  async createZip(fileData, fileNameCompress, fileNameZip) {
    const returnMethod = this.getReturnMethod('createZip');
    const levelCompress = constantUtil.LevelCompress;

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

  async deleteOldZip() {
    const folderPath = path.join(__dirname, '..', 'assets', 'temp');
    const files = readdirSync(folderPath);
    const maxAllowedMsServer = constantUtil.MaxAllowedMinServer * 60 * 1000;
    const returnMethod = this.getReturnMethod('deleteOldZip');
    const deletedFiles = [];
    const serverFiles = [];

    returnMethod.info.push(`info: maxAllowedMsServer = ${maxAllowedMsServer}`);

    try {
      files.forEach((file) => {
        const filePath = path.join(folderPath, file);
        const fileStat = statSync(filePath);
        const fileExtension = path.extname(filePath);
        const timeDifference = new Date().getTime() - fileStat.ctimeMs;
        serverFiles.push(file);

        if (fileStat.isFile() && fileExtension === '.zip' && timeDifference > maxAllowedMsServer) {
          deletedFiles.push(file);
          unlinkSync(filePath);
        }
      });

      returnMethod.response = true;
    } catch (error) {
      await logService.error({ method: returnMethod.nm_method, error });
      returnMethod.info.push(`Error message: ${error.message}`);
      returnMethod.messages.push(constantUtil.MsgErrorDeleteOldZip);
      returnMethod.was_error = true;
      returnMethod.response = null;
    }

    returnMethod.info.push(`info: totalServerFiles = ${serverFiles.length}`);
    returnMethod.info.push(`info: serverFiles = ${serverFiles.join('\n')}`);

    if (deletedFiles.length > 0) {
      returnMethod.info.push(`info: totalDeletedFiles = ${deletedFiles.length}`);
      returnMethod.info.push(`info: deletedFiles = ${deletedFiles.join('\n')}`);
    }

    returnMethod.dt_finish = this.getDateNow();
    return returnMethod;
  }

  rateLimitAPI(qtMaxRate) {
    qtMaxRate = !qtMaxRate ? constantUtil.QtMaxRateMin : +qtMaxRate;

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
