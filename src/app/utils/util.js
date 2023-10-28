import moment from 'moment-timezone';
import { v4 as uuidv4 } from 'uuid';
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

  static getInstance() {
    if (!instance) {
      instance = new Util();
      Object.freeze(instance);
    }
    return instance;
  }
}

export default Util.getInstance();
