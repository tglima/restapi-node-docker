import moment from 'moment-timezone';
import util from '../utils';
import constantUtil from '../utils/constant.util';
import logService from './log.service';

let instance;

class ValidatorService {
  constructor() {
    this.#DateTimeFormat = constantUtil.MomentDateFormat;
  }

  #DateTimeFormat;

  validateDateTime(dateTime) {
    const returnMethod = util.getReturnMethod('validateDateTime');

    returnMethod.info.push(`info: dateTime = ${dateTime}`);
    returnMethod.response = true;

    if (!dateTime) {
      returnMethod.response = false;
      returnMethod.info.push(`info: ${constantUtil.MsgDateTimeIsEmpty}.`);
      returnMethod.messages.push(constantUtil.MsgDateTimeIsEmpty);
    } else if (!moment(dateTime, this.#DateTimeFormat, true).isValid()) {
      returnMethod.response = false;
      returnMethod.info.push(`info: ${constantUtil.MsgInvalidMomentDateFormat}.`);
      returnMethod.messages.push(constantUtil.MsgInvalidMomentDateFormat);
    }

    returnMethod.dt_finish = util.getDateNow();
    return returnMethod;
  }

  valDateTimeRange(startDate, finishDate) {
    const returnMethod = util.getReturnMethod('valDateTimeRange');

    returnMethod.info.push(`info: startDate = ${startDate} finishDate = ${finishDate}`);

    if (moment(startDate, this.#DateTimeFormat).isAfter(moment(finishDate, this.#DateTimeFormat))) {
      returnMethod.messages.push(constantUtil.MsgInvalidDateTimeRange);
      returnMethod.response = false;
    }

    returnMethod.response =
      returnMethod.response === null ? (returnMethod.response = true) : returnMethod.response;

    if (!returnMethod.response) {
      logService.info('invalid datetime range');
    }

    returnMethod.dt_finish = util.getDateNow();
    return returnMethod;
  }

  validatePage(page) {
    const returnMethod = util.getReturnMethod('validatePage');

    returnMethod.response = true;
    returnMethod.info.push(`info: page = ${page}`);

    if (!page || !Number.isSafeInteger(page)) {
      returnMethod.response = false;
      returnMethod.messages.push(`page: ${constantUtil.MsgInvalidValue}`);
    }

    returnMethod.dt_finish = util.getDateNow();
    return returnMethod;
  }

  validateCodeEvent(codeEvent) {
    const returnMethod = util.getReturnMethod('validateCodeEvent');

    returnMethod.response = true;
    returnMethod.info.push(`info: codeEvent = ${codeEvent}`);

    if (!constantUtil.CodeEventFormatRegex.test(codeEvent)) {
      returnMethod.response = false;
      returnMethod.messages.push(`codeEvent: ${constantUtil.MsgInvalidValue}`);
    }

    returnMethod.dt_finish = util.getDateNow();
    return returnMethod;
  }

  valFormatApiKey(apiKey) {
    const returnMethod = util.getReturnMethod('valFormatApiKey');

    returnMethod.response = true;
    returnMethod.info.push(`info: apiKey = ${apiKey}`);

    if (!constantUtil.ApiKeyFormatRegex.test(apiKey)) {
      returnMethod.response = false;
      returnMethod.messages.push(`api_key: ${constantUtil.MsgInvalidValue}`);
    }

    returnMethod.dt_finish = util.getDateNow();
    return returnMethod;
  }

  validateRequest(req) {
    const returnMethod = util.getReturnMethod('validateRequest');

    const publicRoutes = ['/swagger', '/health-check/', '/favicon'];
    const mngRoutes = ['/mng/'];
    const validKeys = constantUtil.ApiKey.split(';');
    const validMngAuth = constantUtil.MngKeyAuth.split(';');

    returnMethod.info.push(`info: req.originalUrl = ${req.originalUrl}`);

    let urlBase = req.originalUrl;

    urlBase = urlBase.replace(`/api/v${constantUtil.NuVersionAPI}`, '');
    returnMethod.info.push(`info: urlBase = ${urlBase}`);

    if (urlBase === '/' || publicRoutes.some((route) => urlBase.includes(route))) {
      returnMethod.response = true;
      returnMethod.info.push("info: it's public route!");
    }

    const apiKey = !req.header('api-key') ? req.header('API-KEY') : req.header('api-key');
    const mngAuth = !req.header('authorization') ? req.header('AUTHORIZATION') : req.header('authorization');

    returnMethod.info.push(`info: apiKey from header = ${apiKey}`);

    if (returnMethod.response === null && apiKey && validKeys.includes(apiKey)) {
      returnMethod.info.push("info: it's valid apiKey");
      returnMethod.response = true;
    }

    if (returnMethod.response === null) {
      returnMethod.info.push('info: invalid apiKey');
      returnMethod.response = false;
    }

    if (!returnMethod.response) {
      logService.info(JSON.stringify(returnMethod));
      returnMethod.messages.push(`api-key: ${constantUtil.MsgStatus401}`);
    }

    if (returnMethod.response && mngRoutes.some((route) => urlBase.includes(route))) {
      if (!validMngAuth.includes(mngAuth)) {
        returnMethod.messages.push(`authentication: ${constantUtil.MsgStatus401}`);
        returnMethod.response = false;
      }
    }

    returnMethod.dt_finish = util.getDateNow();

    return returnMethod;
  }

  static getInstance() {
    if (!instance) {
      instance = new ValidatorService();
      Object.freeze(instance);
    }
    return instance;
  }
}

export default ValidatorService.getInstance();
