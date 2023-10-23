import logRepository, { TypesEvent } from '../repository/sqlite/log.repository';
import productRepository from '../repository/sqlite/product.repository';
import logService from '../services/log.service';
import constantUtil from '../utils/constant.util';
import util from '../utils/util';

class ProductController {
  async findAll(req, res) {
    const LogDTO = {
      dt_start: util.getDateNow(),
      dy_finish: undefined,
      type_event: TypesEvent.REQUEST,
      json_log_event: {
        methods: undefined,
        request_data: undefined,
        response_data: undefined,
      },
    };

    let responseAPI;

    const responseMethod = await productRepository.getAllProducts();
    LogDTO.json_log_event.methods = [responseMethod];

    if (responseMethod.error) {
      responseAPI = {
        status: 500,
        body: { messages: [constantUtil.MsgStatus500] },
      };
    }

    if (!responseAPI && !responseMethod.response) {
      responseAPI = {
        status: 404,
        body: { messages: [constantUtil.MsgStatus404] },
      };
    }

    if (!responseAPI) {
      const products = {
        products: responseMethod.response.map((product) => product.toJSON()),
      };

      responseAPI = { status: 200, body: products };
    }

    LogDTO.json_log_event.request_data = util.getRequestData(req);
    LogDTO.json_log_event.response_data = responseAPI;

    logService.info(JSON.stringify(LogDTO));
    logRepository.saveLogEvent(LogDTO);
    return res.status(responseAPI.status).json(responseAPI.body);
  }

  async findById(req, res) {
    const LogDTO = {
      dt_start: util.getDateNow(),
      dy_finish: undefined,
      type_event: TypesEvent.REQUEST,
      json_log_event: {
        methods: undefined,
        request_data: undefined,
        response_data: undefined,
      },
    };

    let responseAPI;

    let { id } = req.params;
    id = +id;

    if (!id || !Number.isSafeInteger(id)) {
      responseAPI = {
        status: 400,
        body: { messages: [constantUtil.MsgInvalidID] },
      };
    }

    if (!responseAPI) {
      const responseMethod = await productRepository.getProductById(id);
      LogDTO.json_log_event.methods = [responseMethod];

      if (responseMethod.error) {
        responseAPI = {
          status: 500,
          body: { messages: [constantUtil.MsgStatus500] },
        };
      }

      if (!responseAPI && !responseMethod.response) {
        responseAPI = {
          status: 404,
          body: { messages: [constantUtil.MsgStatus404] },
        };
      }

      if (!responseAPI) {
        responseAPI = {
          status: 200,
          body: responseMethod.response.toJSON(),
        };
      }
    }

    LogDTO.json_log_event.request_data = util.getRequestData(req);
    LogDTO.json_log_event.response_data = responseAPI;

    logService.info(JSON.stringify(LogDTO));
    logRepository.saveLogEvent(LogDTO);
    return res.status(responseAPI.status).json(responseAPI.body);
  }
}

export default new ProductController();
