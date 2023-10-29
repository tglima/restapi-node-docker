/* eslint-disable no-unused-vars */
import { readFile } from 'fs/promises';
import path from 'path';
import logRepository, { TypesEvent } from '../repository/sqlite/log.repository';
import logService from '../services/log.service';
import validator from '../services/validator.services';
import constant from '../utils/constant.util';
import dbUtil from '../utils/db.util';
import util from '../utils/util';

async function getZipDataBase(codeEvent) {
  const returnMethod = {
    nm_method: 'getZipDataBase',
    dt_start: util.getDateNow(),
    dt_finish: null,
    was_error: null,
    response: null,
    info: [],
    methods: [],
    messages: [],
  };

  returnMethod.info.push(`info: database = ${dbUtil.DataBaseFileName}`);
  let filePath;
  let fileData;

  try {
    filePath = path.join(__dirname, '..', 'assets', dbUtil.DataBaseFileName);
    fileData = await readFile(filePath);
  } catch (error) {
    logService.error(`method: ${returnMethod.nm_method} => Error: ${error}`);
    returnMethod.info.push(`Error message: ${error.message}`);
    returnMethod.messages.push(constant.MsgErrorFindDb);
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
  const returnMethod = {
    nm_method: 'getResponseAPIRespFind',
    dt_start: util.getDateNow(),
    dt_finish: null,
    was_error: null,
    response: false,
    info: [],
    methods: [],
    messages: [],
  };

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
  const returnMethod = {
    nm_method: 'valFindByDateTime',
    dt_start: util.getDateNow(),
    dt_finish: null,
    was_error: null,
    response: null,
    info: [],
    methods: [],
    messages: [],
  };

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
      returnMethod.messages.push(`dt_start e dt_finish: ${respValDateTimeRange.message}`);
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
    const LogDTO = {
      code_event: util.getNewCodeEvent(),
      dt_start: util.getDateNow(),
      dt_finish: undefined,
      type_event: TypesEvent.REQUEST,
      json_log_event: {
        io_data: {
          request_data: util.getRequestData(req),
          response_data: undefined,
        },
        methods: [],
      },
    };

    let responseAPI = {};
    let respFindDB;
    let isValidQuery = false;
    const messages = [];
    const { dt_start, dt_finish, code_event, api_key } = req.query;
    const page = !req.query.page ? 1 : +req.query.page;

    LogDTO.json_log_event.io_data.request_data = util.getRequestData(req);

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
    const LogDTO = {
      code_event: util.getNewCodeEvent(),
      dt_start: util.getDateNow(),
      dt_finish: undefined,
      type_event: TypesEvent.REQUEST,
      json_log_event: {
        io_data: {
          request_data: util.getRequestData(req),
          response_data: undefined,
        },
        methods: [],
      },
    };

    const messages = [];
    const responseAPI = {};
    let zipPath = null;

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

  async apenasTeste(req, res) {
    const fileData =
      '/home/tglima/MySpace/MyDevSpace/Source/restapi-node-docker/src/app/assets/339ece24-ad1d-419c-bd6a-156e36086dcc.zip';

    res.setHeader('Content-Disposition', `attachment; filename=database.zip`);
    res.setHeader('Content-Type', 'application/zip');
    return res.download(fileData);
  }
}

export default new ManagerController();
