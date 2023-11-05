import swaggerUi from 'swagger-ui-express';
import managerController from '../controllers/manager.controller';
import productController from '../controllers/product.controller';
import swaggerController from '../controllers/swagger.controller';
import utils from '../utils';
import constantUtil from '../utils/constant.util';

const urlBase = `/v${process.env.NU_VERSION}`;
const mngDBBackup = `${urlBase}/mng/database-backup/`;
const mngDBinfo = `${urlBase}/mng/database-info/`;
const mngDbDelete = `${urlBase}/mng/database/delete`;
const mngLogEventsFind = `${urlBase}/mng/log-events/find/`;
const mngLogErrosFind = `${urlBase}/mng/log-errors/find/`;
const productFind = `${urlBase}/products/find`;
const swaggerJSON = '/swagger.json';
const swaggerManagerJSON = '/swagger-manager.json';
const swagger = '/swagger';
const swaggerManager = '/swagger-manager';
const healthCheck = '/health-check';

class Routes {
  constructor() {
    this.#SwaggerJSON = swaggerController.getSwaggerJSON();
    this.#MngSwaggerJSON = swaggerController.getMngSwaggerJSON();
  }

  #SwaggerJSON;

  #MngSwaggerJSON;

  setupRoutes(router) {
    router.use('/', utils.rateLimitAPI());
    router.get('/', (req, res) => {
      res.redirect(swagger);
    });

    router.get(healthCheck, (req, res) => {
      res.status(200).json({
        status: 'OK',
        message: 'API IS UP!',
      });
    });

    router.get(mngDBinfo, managerController.getDataBaseInfo);
    router.use(mngDBBackup, utils.rateLimitAPI(1));
    router.get(mngDBBackup, managerController.getDataBaseFile);
    router.get(mngLogEventsFind, managerController.findLogEvent);
    router.get(mngLogErrosFind, managerController.findLogError);
    router.delete(mngDbDelete, managerController.delRowsDatabase);

    router.get(productFind, productController.find);

    router.get(swaggerJSON, swaggerController.respSwaggerJSON);
    router.get(swaggerManagerJSON, swaggerController.respSwaggerJSON);
    router.use(
      swagger,
      swaggerUi.serveFiles(this.#SwaggerJSON),
      swaggerController.setupSwaggerUI(this.#SwaggerJSON)
    );
    router.use(
      swaggerManager,
      swaggerUi.serveFiles(this.#MngSwaggerJSON, swaggerController.getCustomOptions),
      swaggerController.setupSwaggerUI(this.#MngSwaggerJSON, swaggerController.getCustomOptions)
    );

    router.use((req, res, next) => {
      res.status(404).send(constantUtil.MsgStatus404);
    });
  }
}

export default new Routes();
