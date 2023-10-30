import logRepository, { TypesEvent } from '../repository/sqlite/log.repository';
import util from '../utils';
import logService from './log.service';
import validatorServices from './validator.services';

class AuthService {
  async checkAuth(req, res, next) {
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
    const respValidateRequest = validatorServices.validateRequest(req);

    LogDTO.json_log_event.methods.push(respValidateRequest);

    if (!respValidateRequest.response) {
      respValidateRequest.messages.forEach((message) => {
        messages.push(message);
      });

      const responseAPI = {
        status: 401,
        body: { code_event: LogDTO.code_event, messages },
      };

      LogDTO.json_log_event.io_data.request_data = util.getRequestData(req);
      LogDTO.json_log_event.response_data = responseAPI;
      logService.info('unauthorized request');
      logRepository.saveLogEvent(LogDTO);
      return res.status(responseAPI.status).json(responseAPI.body);
    }
    return next();
  }
}

export default new AuthService();
