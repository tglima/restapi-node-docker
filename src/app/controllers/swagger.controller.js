import swaggerUi from 'swagger-ui-express';

const swaggerJson = require('../assets/swagger.json');

const customOptions = {
  customCss: process.env.SWAGGER_CUSTOM_CSS,
  customSiteTitle: process.env.SWAGGER_CUSTOM_SITE_TITLE,
};

function getSwaggerDocument() {
  const swaggerDocument = swaggerJson;

  if (swaggerDocument.info) {
    if (swaggerDocument.info.version) {
      const { version } = swaggerDocument.info;
      swaggerDocument.info.version = version.replace(
        '{{SWAGGER_INFO_VERSION}}',
        process.env.SWAGGER_INFO_VERSION
      );
    }

    if (swaggerDocument.info.description) {
      const { description } = swaggerDocument.info;
      swaggerDocument.info.description = description.replace(
        '{{SWAGGER_INFO_DESCRIPTION}}',
        process.env.SWAGGER_INFO_DESCRIPTION
      );
    }
  }

  if (swaggerDocument.servers && swaggerDocument.servers[0]) {
    if (swaggerDocument.servers[0].description) {
      const { description } = swaggerDocument.servers[0];

      swaggerDocument.servers[0].description = description.replace(
        '{{SWAGGER_SERVERS_DESCRIPTION}}',
        process.env.SWAGGER_SERVERS_DESCRIPTION
      );
    }

    if (swaggerDocument.servers[0].url) {
      const { url } = swaggerDocument.servers[0];
      swaggerDocument.servers[0].url = url.replace('{{NU_VERSION}}', process.env.NU_VERSION);
    }
  }

  return swaggerDocument;
}

class SwaggerController {
  getSwaggerJSON(req, res) {
    res.json(getSwaggerDocument());
  }

  setupSwaggerUI() {
    return swaggerUi.setup(getSwaggerDocument(), customOptions);
  }
}

export default new SwaggerController();
