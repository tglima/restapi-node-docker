import { Router } from 'express';
import productController from '../controllers/product.controller';

class ProductRoutes {
  constructor() {
    this.router = Router();
    this.router.get('/product/find', productController.findAll);
    this.router.get('/product/find/id=:id?', productController.findById);
  }

  getRoutes() {
    return this.router;
  }
}

export default new ProductRoutes().getRoutes();
