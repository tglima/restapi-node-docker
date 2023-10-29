import { Router } from 'express';
import managerController from '../controllers/manager.controller';

class ManagerRoutes {
  constructor() {
    this.router = Router();
    this.router.get('/mng/database-backup/', managerController.getDataBaseFile);
    this.router.get('/mng/log_events/find/', managerController.findLogEvent);
  }

  getRoutes() {
    return this.router;
  }
}

export default new ManagerRoutes().getRoutes();
