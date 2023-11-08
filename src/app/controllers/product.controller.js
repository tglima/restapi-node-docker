import logRepository, { TypesEvent } from '../repository/log.repository';
import productRepository from '../repository/product.repository';
import logService from '../services/log.service';
import util from '../utils';
import constantUtil from '../utils/constant.util';

async function valFindById(id) {
  const returnMethod = util.getReturnMethod('valFindById');

  returnMethod.info.push(`info: id  = ${id}`);
  id = +id;

  if (!id || !Number.isSafeInteger(id)) {
    returnMethod.info.push('info: not Number.isSafeInteger');
    returnMethod.messages.push(constantUtil.MsgInvalidID);
  }

  returnMethod.info.push(`info: messages.length  = ${returnMethod.messages.length}`);

  if (returnMethod.messages.length === 0) {
    const respFindByById = await productRepository.findById(id);
    returnMethod.methods.push(respFindByById);

    if (respFindByById.was_error) {
      returnMethod.was_error = true;
      returnMethod.info.push(`info: was_error  = ${returnMethod.was_error}`);
      returnMethod.messages.push(constantUtil.MsgStatus500);
    }

    if (!respFindByById.was_error && !respFindByById.response) {
      returnMethod.messages.push(constantUtil.MsgStatus404);
    }

    if (!respFindByById.was_error && respFindByById.response) {
      returnMethod.response = respFindByById.response;
    }
  }

  returnMethod.dt_finish = util.getDateNow();
  return returnMethod;
}

class ProductController {
  async find(req, res) {
    const LogDTO = util.getLogDTO(TypesEvent.REQUEST, req);

    const messages = [];
    const responseAPI = { status: undefined, body: undefined };

    let respFind;
    const { id } = req.query;

    if (id) {
      const respValfindById = await valFindById(id);
      LogDTO.json_log_event.methods.push(respValfindById);
      respValfindById.messages.forEach((message) => {
        messages.push(message);
      });

      respFind = respValfindById;
    } else {
      const respFindAll = await productRepository.findAll();
      LogDTO.json_log_event.methods.push(respFindAll);
      respFindAll.messages.forEach((message) => {
        messages.push(message);
      });

      respFind = respFindAll;
    }

    if (respFind.was_error) {
      responseAPI.status = 500;
    }

    if (!respFind.was_error && !respFind.response) {
      responseAPI.status = 400;
    }

    if (!respFind.was_error && respFind.response) {
      responseAPI.status = 200;
      responseAPI.body = respFind.response;
    }

    if (responseAPI.status !== 200) {
      responseAPI.body = { code_event: LogDTO.code_event, messages };
      logService.info(JSON.stringify(responseAPI));
    }

    LogDTO.json_log_event.io_data.response_data = responseAPI;

    await logRepository.saveLogEvent(LogDTO);
    return res.status(responseAPI.status).json(responseAPI.body);
  }
}

export default new ProductController();
