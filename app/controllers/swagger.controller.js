import swaggerUi from 'swagger-ui-express';
import constantUtil from '../utils/constant.util';

const swaggerJson = require('../assets/swagger.json');
const swaggerManagerJson = require('../assets/swagger-manager.json');

const customOptions = {
  customCss: constantUtil.SwaggerCustomCSS,
  customSiteTitle: constantUtil.CustomSiteTitle,
};

function swaggerJSON() {
  let document = swaggerJson;
  document = JSON.stringify(document);
  document = document.replace('{{NU_VERSION}}', constantUtil.NuVersionAPI);
  document = document.replace('{{SWAGGER_INFO_VERSION}}', constantUtil.SwaggerInfoVersion);
  document = document.replace('{{SWAGGER_INFO_DESCRIPTION}}', constantUtil.SwaggerInfoDesc);
  document = document.replace('{{SWAGGER_SERVERS_DESCRIPTION}}', constantUtil.SwaggerServersDescription);

  return JSON.parse(document);
}

function mngSwaggerJSON() {
  const MsgDBDeleteRows = constantUtil.MsgDatabaseDeleteRows.replace('{{VALUE}}', constantUtil.QtLimitDelete);

  let document = swaggerManagerJson;
  document = JSON.stringify(document);
  document = document.replace('{{NU_VERSION}}', constantUtil.NuVersionAPI);
  document = document.replace('{{MSG_DATABASE_DELETE_ROWS}}', MsgDBDeleteRows);
  document = document.replace('{{QTD_ITEMS_DELETE}}', constantUtil.QtLimitDelete);
  document = document.replace('{{SWAGGER_INFO_DESCRIPTION_MNG}}', constantUtil.SwaggerInfoDescMng);
  document = document.replace('{{SWAGGER_SERVERS_DESCRIPTION}}', constantUtil.SwaggerServersDescription);

  return JSON.parse(document);
}

class SwaggerController {
  async respSwaggerJSON(req, res) {
    if (req.originalUrl.includes('swagger-manager')) {
      return res.status(200).json(mngSwaggerJSON());
    }
    return res.status(200).json(swaggerJSON());
  }

  getCustomOptions() {
    return customOptions;
  }

  getSwaggerJSON() {
    return swaggerJSON();
  }

  getMngSwaggerJSON() {
    return mngSwaggerJSON();
  }

  setupSwaggerUI(jsonDocument) {
    return swaggerUi.setup(jsonDocument, customOptions);
  }
}

export default new SwaggerController();
