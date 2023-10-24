import logRepository, { TypesEvent } from '../repository/sqlite/log.repository';
import constantUtil from '../utils/constant.util';
import util from '../utils/util';
import logService from './log.service';

function validateRequest(req) {
  const publicRoutes = ['/swagger', '/health-check/'];
  const validKeys = process.env.API_KEY.split(';');
  const returnMethod = {};
  returnMethod.nm_method = 'validateRequest';
  returnMethod.dt_start = util.getDateNow();
  returnMethod.dt_finish = undefined;
  returnMethod.was_error = false;
  returnMethod.response = undefined;
  const info = [];

  info.push(`info: req.originalUrl = ${req.originalUrl}`);

  let urlBase = req.originalUrl;

  urlBase = urlBase.replace(`/api/v${process.env.NU_VERSION}`, '');
  info.push(`info: urlBase = ${urlBase}`);

  if (
    urlBase === '/' ||
    publicRoutes.some((route) => urlBase.includes(route))
  ) {
    returnMethod.dt_finish = util.getDateNow();
    returnMethod.response = true;
    info.push("info: it's public route!");
  }

  const apiKey = !req.header('x-api-key')
    ? req.header('X-API-KEY')
    : req.header('x-api-key');

  info.push(`info: apiKey from header = ${apiKey}`);

  if (!returnMethod.dt_finish && apiKey && validKeys.includes(apiKey)) {
    info.push("info: it's valid apiKey");
    returnMethod.dt_finish = util.getDateNow();
    returnMethod.response = true;
  }

  if (!returnMethod.dt_finish) {
    info.push('info: invalid apiKey');
    returnMethod.dt_finish = util.getDateNow();
    returnMethod.response = false;
  }

  if (!returnMethod.dt_finish) {
    info.push('info: method failure');
    returnMethod.dt_finish = util.getDateNow();
    returnMethod.response = false;
  }

  returnMethod.info = info;

  if (!returnMethod.response) {
    logService.info(JSON.stringify(returnMethod));
  }
  return returnMethod;
}

class AuthService {
  async checkAuth(req, res, next) {
    const LogDTO = {
      dt_start: util.getDateNow(),
      dt_finish: undefined,
      type_event: TypesEvent.REQUEST,
      json_log_event: {
        methods: undefined,
        request_data: undefined,
        response_data: undefined,
      },
    };

    LogDTO.json_log_event.request_data = util.getRequestData(req);
    const responseMethod = validateRequest(req);

    LogDTO.json_log_event.methods = [responseMethod];

    if (!responseMethod.response) {
      const responseAPI = {
        status: 401,
        body: { messages: [constantUtil.MsgStatus401] },
      };

      LogDTO.json_log_event.response_data = responseAPI;
      logService.info('unauthorized request');
      logRepository.saveLogEvent(LogDTO);
      return res.status(responseAPI.status).json(responseAPI.body);
    }
    return next();
  }
}

export default new AuthService();
