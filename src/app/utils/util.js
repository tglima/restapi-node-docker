import moment from 'moment-timezone';
import constantUtil from './constant.util';

let instance;

class Util {
  getDateNow() {
    const dateNow = moment()
      .tz(constantUtil.MomentTimeZone)
      .format(constantUtil.MomentDateFormat);

    return dateNow;
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
