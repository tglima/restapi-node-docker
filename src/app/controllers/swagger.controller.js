import swaggerUi from 'swagger-ui-express';
import constantUtil from '../utils/constant.util';

const swaggerJson = require('../assets/swagger.json');
const swaggerManagerJson = require('../assets/swagger-manager.json');

const nuVersion = process.env.NU_VERSION || 1;

const customOptions = {
  customCss: process.env.SWAGGER_CUSTOM_CSS,
  customSiteTitle: process.env.SWAGGER_CUSTOM_SITE_TITLE,
};

function getSwaggerDocument() {
  let document = swaggerJson;
  document = JSON.stringify(document);
  document = document.replace('{{NU_VERSION}}', nuVersion);
  document = document.replace('{{SWAGGER_INFO_VERSION}}', process.env.SWAGGER_INFO_VERSION);
  document = document.replace('{{SWAGGER_INFO_DESCRIPTION}}', process.env.SWAGGER_INFO_DESCRIPTION);
  document = document.replace('{{SWAGGER_SERVERS_DESCRIPTION}}', process.env.SWAGGER_SERVERS_DESCRIPTION);

  return JSON.parse(document);
}

function getMngSwaggerDocument() {
  const QtLimitDelete = process.env.QT_LIMIT_DELETE || '10';
  const MsgDatabaseDeleteRows = constantUtil.MsgDatabaseDeleteRows.replace('{{VALUE}}', QtLimitDelete);

  let document = swaggerManagerJson;
  document = JSON.stringify(document);
  document = document.replace('{{NU_VERSION}}', nuVersion);
  document = document.replace('{{QTD_ITEMS_DELETE}}', QtLimitDelete);
  document = document.replace('{{MSG_DATABASE_DELETE_ROWS}}', MsgDatabaseDeleteRows);
  document = document.replace('{{SWAGGER_SERVERS_DESCRIPTION}}', process.env.SWAGGER_SERVERS_DESCRIPTION);
  document = document.replace('{{SWAGGER_INFO_DESCRIPTION_MNG}}', process.env.SWAGGER_INFO_DESCRIPTION_MNG);

  return JSON.parse(document);
}

class SwaggerController {
  getSwaggerJSON(req, res) {
    res.json(getSwaggerDocument());
  }

  setupSwaggerUI() {
    return swaggerUi.setup(getSwaggerDocument(), customOptions);
  }

  getMngSwaggerJSON(req, res) {
    res.json(getMngSwaggerDocument());
  }

  setupMngSwaggerUI() {
    return swaggerUi.setup(getMngSwaggerDocument(), customOptions);
  }
}

export default new SwaggerController();
