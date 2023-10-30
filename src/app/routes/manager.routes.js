import { Router } from 'express';
import managerController from '../controllers/manager.controller';

class ManagerRoutes {
  constructor() {
    this.router = Router();
    this.router.get('/mng/database-backup/', managerController.getDataBaseFile);
    this.router.get('/mng/database-info/', managerController.getDataBaseInfo);
    this.router.get('/mng/log-events/find/', managerController.findLogEvent);
    this.router.delete('/mng/database/delete', managerController.delRowsDatabase);
  }

  getRoutes() {
    return this.router;
  }
}

export default new ManagerRoutes().getRoutes();
