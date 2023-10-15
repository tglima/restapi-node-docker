import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerController from '../controllers/swagger.controller';

class SwaggerRoutes {
  constructor() {
    this.router = Router();
    this.setupRoutes();
  }

  setupRoutes() {
    this.router.get('/swagger.json', swaggerController.getSwaggerJSON);
    this.router.use('', swaggerUi.serve, swaggerController.setupSwaggerUI());
  }

  getRoutes() {
    return this.router;
  }
}

export default new SwaggerRoutes().getRoutes();
