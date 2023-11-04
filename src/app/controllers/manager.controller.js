/* eslint-disable no-unused-vars */
import { readFile } from 'fs/promises';
import path from 'path';
import logRepository, { TypesEvent } from '../repository/log.repository';
import productRepository from '../repository/product.repository';
import logService from '../services/log.service';
import validator from '../services/validator.services';
import util from '../utils';
import constant from '../utils/constant.util';
import dbUtil from '../utils/db.util';

async function getZipDataBase(codeEvent) {
  const returnMethod = util.getReturnMethod('getZipDataBase');

  returnMethod.info.push(`info: database = ${dbUtil.DataBaseFileName}`);
  let filePath;
  let fileData;

  try {
    filePath = path.join(__dirname, '..', 'assets', dbUtil.DataBaseFileName);
    fileData = await readFile(filePath);
  } catch (error) {
    await logService.error({ method: returnMethod.nm_method, error });
    returnMethod.messages.push(constant.MsgErrorFindDb);
    returnMethod.info.push(`Error message: ${error.message}`);
    returnMethod.was_error = true;
    returnMethod.response = null;
  }

  returnMethod.info.push(`info: filePath = ${filePath}`);

  if (fileData) {
    const respCreateZip = await util.createZip(fileData, dbUtil.DataBaseFileName, `${codeEvent}.zip`);

    if (respCreateZip.was_error || !respCreateZip.response) {
      respCreateZip.messages.forEach((message) => {
        returnMethod.messages.push(message);
      });

      returnMethod.response = null;
      returnMethod.info.push(`info: zipFile: is null`);
    } else {
      returnMethod.info.push(`info: zipFile generated`);
      returnMethod.response = respCreateZip.response;
    }
  } else {
    returnMethod.info.push(`info: fileData is null`);
    returnMethod.messages.push(constant.MsgFailGetFile);
  }

  if (!returnMethod.response) {
    logService.info(JSON.stringify(returnMethod));
  }

  returnMethod.dt_finish = util.getDateNow();
  return returnMethod;
}

function getResponseAPIRespFind(respFind, code_event) {
  const returnMethod = util.getReturnMethod('getResponseAPIRespFind');

  returnMethod.info.push(`info: respFind = ${respFind}`);

  let responseAPI = { status: 400, body: { code_event, messages: [] } };

  if (respFind.error) {
    responseAPI = {
      status: 500,
      body: { code_event, messages: [constant.MsgStatus500] },
    };
  }

  if (!respFind.error && !respFind.response) {
    responseAPI = {
      status: 404,
      body: { code_event, messages: [constant.MsgStatus404] },
    };
  }

  if (!respFind.error && respFind.response) {
    const logsDB = respFind.response;
    responseAPI = {
      status: 200,
      body: logsDB,
    };
  }

  returnMethod.response = responseAPI;

  if (responseAPI.status !== 200) {
    logService.info(JSON.stringify(returnMethod));
  }

  returnMethod.dt_finish = util.getDateNow();
  return returnMethod;
}

function valFindByApiKey(api_key, page) {
  const returnMethod = {
    nm_method: 'valFindByApiKey',
    dt_start: util.getDateNow(),
    dt_finish: null,
    was_error: null,
    response: false,
    info: [],
    methods: [],
    messages: [],
  };

  const respValFormatApiKey = validator.valFormatApiKey(api_key);
  returnMethod.methods.push(respValFormatApiKey);

  if (!respValFormatApiKey.response) {
    respValFormatApiKey.messages.forEach((message) => {
      returnMethod.messages.push(message);
    });
  }

  const respValidatePage = validator.validatePage(page);
  returnMethod.methods.push(respValidatePage);

  if (!respValidatePage.response) {
    respValidatePage.messages.forEach((message) => {
      returnMethod.messages.push(message);
    });
  }

  if (respValidatePage.response && respValFormatApiKey.response) {
    returnMethod.response = true;
  }

  if (!returnMethod.response) {
    logService.info(JSON.stringify(returnMethod));
  }

  returnMethod.dt_finish = util.getDateNow();
  return returnMethod;
}

function valFindByDateTime(dt_start, dt_finish, page) {
  const returnMethod = util.getReturnMethod('valFindByDateTime');

  let isValidNuPage = true;
  let isValidDtStart = true;
  let isValidDtFinish = true;
  let isValidRangeDate = true;

  returnMethod.info.push(`info: dt_start = ${dt_start}`);
  returnMethod.info.push(`info: dt_finish = ${dt_finish}`);
  returnMethod.info.push(`info: page = ${page}`);
  returnMethod.response = false;

  const respValPage = validator.validatePage(page);
  returnMethod.methods.push(respValPage);

  if (!respValPage.response) {
    isValidNuPage = false;
    returnMethod.messages.push(`${respValPage.messages}`);
  }

  const respValDtStart = validator.validateDateTime(dt_start);
  returnMethod.methods.push(respValDtStart);

  if (!respValDtStart.response) {
    isValidDtStart = false;
    returnMethod.messages.push(`dt_start: ${respValDtStart.messages[0]}`);
  }

  const returnValDtFinish = validator.validateDateTime(dt_finish);
  returnMethod.methods.push(returnValDtFinish);

  if (!returnValDtFinish.response) {
    isValidDtFinish = false;
    returnMethod.messages.push(`dt_finish: ${returnValDtFinish.messages[0]}`);
  }

  if (isValidDtStart && isValidDtFinish) {
    const respValDateTimeRange = validator.valDateTimeRange(dt_start, dt_finish);
    returnMethod.methods.push(respValDateTimeRange);
    if (!respValDateTimeRange.response) {
      isValidRangeDate = false;
      returnMethod.messages.push(`dt_start e dt_finish: ${respValDateTimeRange.messages[0]}`);
    }
  }

  if (isValidNuPage && isValidDtStart && isValidDtFinish && isValidRangeDate) {
    returnMethod.response = true;
  }

  if (!returnMethod.response) {
    logService.info(JSON.stringify(returnMethod));
  }

  returnMethod.dt_finish = util.getDateNow();
  return returnMethod;
}

class ManagerController {
  async findLogEvent(req, res) {
    const LogDTO = util.getLogDTO(TypesEvent.REQUEST, req);

    let responseAPI = {};
    let respFindDB;
    let isValidQuery = false;
    const messages = [];
    const { dt_start, dt_finish, code_event, api_key } = req.query;
    const page = !req.query.page ? 1 : +req.query.page;

    if (dt_start && dt_finish) {
      isValidQuery = true;
      const respValFindByDateTime = valFindByDateTime(dt_start, dt_finish, page);
      LogDTO.json_log_event.methods.push(respValFindByDateTime);
      if (!respValFindByDateTime.response) {
        respValFindByDateTime.messages.forEach((message) => {
          messages.push(message);
        });
        responseAPI.status = 400;
        responseAPI.body = { code_event: LogDTO.code_event, messages };
      }

      if (respValFindByDateTime.response) {
        respFindDB = await logRepository.findByDateRange(dt_start, dt_finish, page);
      }
    }

    if (!isValidQuery && code_event) {
      isValidQuery = true;
      const respValidateCodeEvent = validator.validateCodeEvent(code_event);
      LogDTO.json_log_event.methods.push(respValidateCodeEvent);
      if (!respValidateCodeEvent.response) {
        respValidateCodeEvent.messages.forEach((message) => {
          messages.push(message);
        });
        responseAPI.status = 400;
        responseAPI.body = { code_event: LogDTO.code_event, messages };
      }

      if (respValidateCodeEvent.response) {
        respFindDB = await logRepository.findByCodeEvent(code_event);
      }
    }

    if (!isValidQuery && api_key) {
      isValidQuery = true;
      const respValFindByApiKey = valFindByApiKey(api_key, page);
      LogDTO.json_log_event.methods.push(respValFindByApiKey);

      if (!respValFindByApiKey.response) {
        respValFindByApiKey.messages.forEach((message) => {
          messages.push(message);
        });

        responseAPI.status = 400;
        responseAPI.body = { code_event: LogDTO.code_event, messages };
      }

      if (respValFindByApiKey.response) {
        respFindDB = await logRepository.findByApiKey(api_key, page);
      }
    }

    if (!isValidQuery) {
      responseAPI.status = 400;
      LogDTO.json_log_event.messages.push(constant.MsgInvalidQueryParams);
      responseAPI.body = { code_event: LogDTO.code_event, messages };

      LogDTO.json_log_event.response_data = responseAPI;
      await logRepository.saveLogEvent(LogDTO);
      return res.status(responseAPI.status).json(responseAPI.body);
    }

    if (!responseAPI.status) {
      const respGetResponseAPIRespFind = getResponseAPIRespFind(respFindDB, LogDTO.code_event);
      responseAPI = respGetResponseAPIRespFind.response;
    }

    LogDTO.json_log_event.io_data.response_data = responseAPI;

    await logRepository.saveLogEvent(LogDTO);
    return res.status(responseAPI.status).json(responseAPI.body);
  }

  async getDataBaseFile(req, res) {
    const LogDTO = util.getLogDTO(TypesEvent.REQUEST, req);
    const messages = [];
    const responseAPI = {};
    let zipPath = null;

    const respDeleteOldZip = await util.deleteOldZip();
    LogDTO.json_log_event.methods.push(respDeleteOldZip);

    const respGetZipDataBase = await getZipDataBase(LogDTO.code_event);

    LogDTO.json_log_event.methods.push(respGetZipDataBase);

    if (!respGetZipDataBase.response) {
      respGetZipDataBase.messages.forEach((message) => {
        messages.push(message);
      });

      responseAPI.status = 500;
      responseAPI.body = { code_event: LogDTO.code_event, messages };
    } else {
      responseAPI.status = 200;
      responseAPI.body = { file: `${LogDTO.code_event}.zip` };
      responseAPI.header = {
        'Content-Disposition': `attachment; filename=${LogDTO.code_event}.zip`,
        'Content-Type': 'application/zip',
      };

      zipPath = respGetZipDataBase.response;
    }

    LogDTO.json_log_event.io_data.response_data = responseAPI;

    await logRepository.saveLogEvent(LogDTO);

    if (responseAPI.status !== 200) {
      return res.status(responseAPI.status).json(responseAPI.body);
    }

    res.set(responseAPI.header);
    return res.sendFile(zipPath);
  }

  async getDataBaseInfo(req, res) {
    const LogDTO = util.getLogDTO(TypesEvent.REQUEST, req);
    const messages = [];
    const responseAPI = { status: undefined, body: undefined };
    const jsonDBInfo = {
      database_name: undefined,
      database_size: undefined,
      tables_name: [],
      product_total: undefined,
      log_event_total: undefined,
      log_error_total: undefined,
    };

    const respDeleteOldZip = await util.deleteOldZip();
    LogDTO.json_log_event.methods.push(respDeleteOldZip);

    const respCountProduct = await productRepository.countProduct();
    LogDTO.json_log_event.methods.push(respCountProduct);

    if (respCountProduct.was_error) {
      respCountProduct.messages.forEach((message) => {
        messages.push(message);
      });
      responseAPI.status = 500;
    } else {
      jsonDBInfo.product_total = respCountProduct.response;
    }

    if (!responseAPI.status) {
      const respCountLogEvent = await logRepository.countLogEvent();
      LogDTO.json_log_event.methods.push(respCountLogEvent);

      if (respCountLogEvent.was_error) {
        respCountLogEvent.messages.forEach((message) => {
          messages.push(message);
        });
        responseAPI.status = 500;
      } else {
        jsonDBInfo.log_event_total = respCountLogEvent.response;
      }
    }

    if (!responseAPI.status) {
      const respCountLogError = await logRepository.countLogError();
      LogDTO.json_log_event.methods.push(respCountLogError);

      if (respCountLogError.was_error) {
        respCountLogError.messages.forEach((message) => {
          messages.push(message);
        });
        responseAPI.status = 500;
      } else {
        jsonDBInfo.log_error_total = respCountLogError.response;
      }
    }

    if (!responseAPI.status) {
      const respGetTableNames = await dbUtil.getTableNames();
      LogDTO.json_log_event.methods.push(respGetTableNames);

      if (respGetTableNames.was_error) {
        respGetTableNames.messages.forEach((message) => {
          messages.push(message);
        });
        responseAPI.status = 500;
      } else {
        const tableNames = respGetTableNames.response;
        jsonDBInfo.tables_name = tableNames;
      }
    }

    if (!responseAPI.status) {
      const respGetDataBaseSize = await dbUtil.getDataBaseSize();
      LogDTO.json_log_event.methods.push(respGetDataBaseSize);

      if (respGetDataBaseSize.was_error) {
        respGetDataBaseSize.messages.forEach((message) => {
          messages.push(message);
        });
        responseAPI.status = 500;
      } else {
        const dataBaseSize = respGetDataBaseSize.response;
        jsonDBInfo.database_size = `${dataBaseSize}mb`;
      }
    }

    if (!responseAPI.status) {
      jsonDBInfo.database_name = dbUtil.DataBaseFileName;
      responseAPI.status = 200;
    }

    if (responseAPI.status === 500) {
      responseAPI.body = { code_event: LogDTO.code_event, messages };
      logService.info(JSON.stringify(responseAPI));
    } else {
      responseAPI.body = jsonDBInfo;
    }

    LogDTO.json_log_event.io_data.response_data = responseAPI;

    await logRepository.saveLogEvent(LogDTO);
    return res.status(responseAPI.status).json(responseAPI.body);
  }

  async delRowsDatabase(req, res) {
    const LogDTO = util.getLogDTO(TypesEvent.REQUEST, req);

    const responseAPI = { status: undefined, body: undefined };
    const messages = [];
    let { table_name } = req.query;

    LogDTO.json_log_event.info.push(`table_name = ${table_name}`);

    table_name = table_name ? table_name.toLowerCase() : undefined;

    const validTableNames = ['log_event', 'log_error'];

    if (!table_name || !validTableNames.includes(table_name)) {
      LogDTO.json_log_event.info.push('table_name invalid');
      responseAPI.status = 400;
      messages.push(constant.MsgInvalidID.replace('id', 'table_name'));
    }

    if (table_name === 'log_event') {
      const respDeleteLogEvent = await logRepository.deleteLogEvent();
      LogDTO.json_log_event.methods.push(respDeleteLogEvent);

      respDeleteLogEvent.messages.forEach((message) => {
        messages.push(message);
      });

      if (respDeleteLogEvent.was_error) {
        responseAPI.status = 500;
        messages.push(constant.MsgStatus500);
      } else {
        responseAPI.status = 200;
      }
    }

    if (table_name === 'log_error') {
      const respDeleteLogError = await logRepository.deleteLogError();
      LogDTO.json_log_event.methods.push(respDeleteLogError);

      respDeleteLogError.messages.forEach((message) => {
        messages.push(message);
      });

      if (respDeleteLogError.was_error) {
        responseAPI.status = 500;
        messages.push(constant.MsgStatus500);
      } else {
        responseAPI.status = 200;
      }
    }

    if (responseAPI.status !== 200) {
      responseAPI.body = { code_event: LogDTO.code_event, messages };
      logService.info(JSON.stringify(responseAPI));
    } else {
      responseAPI.body = { messages };
    }

    LogDTO.json_log_event.io_data.response_data = responseAPI;

    await logRepository.saveLogEvent(LogDTO);
    return res.status(responseAPI.status).json(responseAPI.body);
  }
}

export default new ManagerController();
