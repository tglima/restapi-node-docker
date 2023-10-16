import { Router } from 'express';
import healthRoutes from './health.routes';
import swaggerRoutes from './swagger.routes';

class Routes {
  constructor() {
    this.router = Router();
    this.setupRoutes();
  }

  setupRoutes() {
    this.router.use('/swagger', swaggerRoutes);
    this.router.use('', healthRoutes);
  }

  getRoutes() {
    return this.router;
  }
}

export default new Routes().getRoutes();
