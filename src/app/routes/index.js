import { Router } from 'express';
import healthRoutes from './health.routes';
import managerRoutes from './manager.routes';
import productRoutes from './product.routes';
import swaggerRoutes from './swagger.routes';

const urlBase = `/v${process.env.NU_VERSION}`;

class Routes {
  constructor() {
    this.router = Router();
    this.setupRoutes();
  }

  setupRoutes() {
    this.router.use('', swaggerRoutes);
    this.router.use('', healthRoutes);
    this.router.use(urlBase, productRoutes);
    this.router.use(urlBase, managerRoutes);
    this.router.get('/', (req, res) => {
      res.redirect('/swagger');
    });
  }

  getRoutes() {
    return this.router;
  }
}

export default new Routes().getRoutes();
