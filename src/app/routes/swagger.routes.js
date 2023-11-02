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
    this.router.get('/swagger-manager.json', swaggerController.getMngSwaggerJSON);
    this.router.use('/swagger', swaggerUi.serve, swaggerController.setupSwaggerUI());
    this.router.use('/swagger-manager', swaggerUi.serve, swaggerController.setupMngSwaggerUI());
  }

  getRoutes() {
    return this.router;
  }
}

export default new SwaggerRoutes().getRoutes();
