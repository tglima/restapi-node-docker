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

  static getInstance() {
    if (!instance) {
      instance = new Util();
      Object.freeze(instance);
    }
    return instance;
  }
}

export default Util.getInstance();
