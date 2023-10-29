import { Router } from 'express';
import productController from '../controllers/product.controller';

class ProductRoutes {
  constructor() {
    this.router = Router();
    this.router.get('/products/find', productController.find);
  }

  getRoutes() {
    return this.router;
  }
}

export default new ProductRoutes().getRoutes();
