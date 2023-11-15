import supertest from 'supertest';
import constantUtil from '../../app/utils/constant.util';

const urlDBDelete = `/v${constantUtil.NuVersionAPI}/mng/database/delete`;
const urlDBBackup = `/v${constantUtil.NuVersionAPI}/mng/database-backup`;
const urlDBInfo = `/v${constantUtil.NuVersionAPI}/mng/database-info`;

const apiKey = constantUtil.ApiKey;
const authorization = constantUtil.MngKeyAuth;

describe('Database-Delete Check BadRequest', () => {
  it('should return status 400 - DELETE /', async () => {
    const response = await supertest(global.server)
      .delete(`${urlDBDelete}?table_name=${constantUtil.ApiKey}`)
      .set('API-KEY', `${apiKey}`)
      .set('AUTHORIZATION', `${authorization}`);
    expect(response.status).toBe(400);
  });

  it('should return status 400 - DELETE /', async () => {
    const response = await supertest(global.server)
      .delete(`${urlDBDelete}?table_name=LOG_ERRORS`)
      .set('API-KEY', `${apiKey}`)
      .set('AUTHORIZATION', `${authorization}`);
    expect(response.status).toBe(400);
  });
});

describe('Database-backup Endpoints Check Authorization', () => {
  it('should return status 401 - GET /', async () => {
    const response = await supertest(global.server).get(`${urlDBBackup}`);
    expect(response.status).toBe(401);
  });

  it('should return status 401 - GET /', async () => {
    const response = await supertest(global.server)
      .get(`${urlDBBackup}`)
      .set('API-KEY', `${constantUtil.NuVersionAPI}`);
    expect(response.status).toBe(401);
  });

  it('should return status 401 - GET /', async () => {
    const response = await supertest(global.server)
      .get(`${urlDBBackup}`)
      .set('API-KEY', `${apiKey}`)
      .set('x-cookie', `${authorization}`);
    expect(response.status).toBe(401);
  });

  it('should return status 401 - GET /', async () => {
    const response = await supertest(global.server)
      .get(`${urlDBBackup}`)
      .set('API-KEY', '')
      .set('AUTHORIZATION', `${authorization}`);
    expect(response.status).toBe(401);
  });

  it('should return status 401 - GET /', async () => {
    const response = await supertest(global.server)
      .get(`${urlDBBackup}`)
      .set('API-KEY', '')
      .set('AUTHORIZATION', '');
    expect(response.status).toBe(401);
  });

  //
});

describe('Database-Delete Endpoints Check Authorization', () => {
  it('should return status 401 - DELETE /', async () => {
    const response = await supertest(global.server).delete(`${urlDBDelete}`);
    expect(response.status).toBe(401);
  });

  it('should return status 401 - DELETE /', async () => {
    const response = await supertest(global.server)
      .delete(`${urlDBDelete}`)
      .set('API-KEY', `${constantUtil.Port}`);
    expect(response.status).toBe(401);
  });

  it('should return status 401 - DELETE /', async () => {
    const response = await supertest(global.server)
      .delete(`${urlDBDelete}`)
      .set('API-KEY', `${apiKey}`)
      .set('x-cookie', `${authorization}`);
    expect(response.status).toBe(401);
  });

  it('should return status 401 - DELETE /', async () => {
    const response = await supertest(global.server)
      .delete(`${urlDBDelete}`)
      .set('API-KEY', '')
      .set('AUTHORIZATION', `${authorization}`);
    expect(response.status).toBe(401);
  });

  it('should return status 401 - DELETE /', async () => {
    const response = await supertest(global.server)
      .delete(`${urlDBDelete}`)
      .set('API-KEY', '')
      .set('AUTHORIZATION', '');
    expect(response.status).toBe(401);
  });
});

describe('Database-Info Endpoints Check Authorization', () => {
  it('should return status 401 - GET /', async () => {
    const response = await supertest(global.server).get(`${urlDBInfo}`);
    expect(response.status).toBe(401);
  });

  it('should return status 401 - GET /', async () => {
    const response = await supertest(global.server)
      .get(`${urlDBInfo}`)
      .set('API-KEY', `${constantUtil.NuVersionAPI}`);

    expect(response.status).toBe(401);
  });

  it('should return status 401 - GET /', async () => {
    const response = await supertest(global.server).get(`${urlDBInfo}`).set('API-KEY', `${apiKey}`);

    expect(response.status).toBe(401);
  });

  it('should return status 401 - GET /', async () => {
    const response = await supertest(global.server)
      .get(`${urlDBInfo}`)
      .set('API-KEY', '')
      .set('AUTHORIZATION', `${authorization}`);
    expect(response.status).toBe(401);
  });

  it('should return status 401 - GET /', async () => {
    const response = await supertest(global.server)
      .get(`${urlDBInfo}`)
      .set('API-KEY', '')
      .set('AUTHORIZATION', '');
    expect(response.status).toBe(401);
  });
});

describe('Database Endpoints Check OK', () => {
  it('should return status 200 - GET /', async () => {
    const response = await supertest(global.server)
      .get(`${urlDBInfo}`)
      .set('API-KEY', `${apiKey}`)
      .set('AUTHORIZATION', `${authorization}`);
    expect(response.status).toBe(200);
  });

  it('should return status 200 - DELETE /', async () => {
    const response = await supertest(global.server)
      .delete(`${urlDBDelete}?table_name=log_error`)
      .set('API-KEY', `${apiKey}`)
      .set('AUTHORIZATION', `${authorization}`);
    expect(response.status).toBe(200);
  });

  it('should return status 200 - DELETE /', async () => {
    const response = await supertest(global.server)
      .delete(`${urlDBDelete}?table_name=log_event`)
      .set('API-KEY', `${apiKey}`)
      .set('AUTHORIZATION', `${authorization}`);
    expect(response.status).toBe(200);
  });
});

describe('Database-backup Endpoints Check 200 || 429', () => {
  it('should return status 200 - GET /', async () => {
    const response = await supertest(global.server)
      .get(`${urlDBBackup}`)
      .set('API-KEY', `${apiKey}`)
      .set('AUTHORIZATION', `${authorization}`);
    expect(response.status).toBe(200);
  });

  it('should return status 429 - GET /', async () => {
    const response = await supertest(global.server)
      .get(`${urlDBBackup}`)
      .set('API-KEY', `${apiKey}`)
      .set('AUTHORIZATION', `${authorization}`);
    expect(response.status).toBe(429);
  });
});
