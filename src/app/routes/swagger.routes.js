import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerController from '../controllers/swagger.controller';

class SwaggerRoutes {
  constructor() {
    this.router = Router();
    this.#SwaggerJSON = swaggerController.getSwaggerJSON();
    this.#MngSwaggerJSON = swaggerController.getMngSwaggerJSON();
    this.setupRoutes();
  }

  #SwaggerJSON;

  #MngSwaggerJSON;

  setupRoutes() {
    this.router.get('/swagger.json', swaggerController.respSwaggerJSON);
    this.router.get('/swagger-manager.json', swaggerController.respSwaggerJSON);
    this.router.use(
      '/swagger',
      swaggerUi.serveFiles(this.#SwaggerJSON),
      swaggerController.setupSwaggerUI(this.#SwaggerJSON)
    );
    this.router.use(
      '/swagger-manager',
      swaggerUi.serveFiles(this.#MngSwaggerJSON, swaggerController.getCustomOptions),
      swaggerController.setupSwaggerUI(this.#MngSwaggerJSON, swaggerController.getCustomOptions)
    );
  }

  getRoutes() {
    return this.router;
  }
}

export default new SwaggerRoutes().getRoutes();
