import { Router } from 'express';

function healthCheck(req, res) {
  return res.status(200).json({
    status: 'OK',
    message: 'API IS UP!',
  });
}

class HealthRoutes {
  constructor() {
    this.router = Router();
    this.router.get('/health-check', healthCheck);
  }

  getRoutes() {
    return this.router;
  }
}

export default new HealthRoutes().getRoutes();
