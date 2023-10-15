import { Router } from 'express';
import swaggerRoutes from './swagger.routes';

class Routes {
  constructor() {
    this.router = Router();
    this.setupRoutes();
  }

  setupRoutes() {
    this.router.use('/swagger', swaggerRoutes);
  }

  getRoutes() {
    return this.router;
  }
}

export default new Routes().getRoutes();
