import constantUtil from '../utils/constant.util';

class AuthService {
  async checkAuth(req, res, next) {
    let urlBase = req.originalUrl;
    const response401 = { message: [constantUtil.MsgStatus401] };
    urlBase = urlBase.replace(`/api/v${process.env.NU_VERSION}`, '');

    if (urlBase === '/') {
      return next();
    }

    if (urlBase.includes('/swagger')) {
      return next();
    }

    if (urlBase.includes('/health-check/')) {
      return next();
    }

    const apiKey = !req.header('x-api-key')
      ? req.header('X-API-KEY')
      : req.header('x-api-key');

    if (!apiKey) {
      return res.status(401).send(response401);
    }

    const validKeys = process.env.API_KEY.split(';');

    if (validKeys.includes(apiKey)) {
      return next();
    }

    return res.status(401).send(response401);
  }
}

export default new AuthService();
