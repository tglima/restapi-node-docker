import supertest from 'supertest';
import constantUtil from '../../app/utils/constant.util';

const urlBase = `/v${constantUtil.NuVersionAPI}/mng/log-errors`;
const apiKey = constantUtil.ApiKey;
const authorization = constantUtil.MngKeyAuth;
const dt_start = '2023-11-02 19:50:00';
const dt_finish = '2023-11-05 13:00:00';

describe('LogErrors Endpoints Check BadRequest', () => {
  it('should return status 400 - GET /', async () => {
    const response = await supertest(global.server)
      .get(`${urlBase}/find?id_log_error=ddd`)
      .set('API-KEY', `${apiKey}`)
      .set('AUTHORIZATION', `${authorization}`);
    expect(response.status).toBe(400);
  });

  it('should return status 400 - GET /', async () => {
    const response = await supertest(global.server)
      .get(`${urlBase}/find?dt_start=ddd`)
      .set('API-KEY', `${apiKey}`)
      .set('AUTHORIZATION', `${authorization}`);
    expect(response.status).toBe(400);
  });

  it('should return status 400 - GET /', async () => {
    const response = await supertest(global.server)
      .get(`${urlBase}/find?dt_start=ddd&dt_finish=ddd`)
      .set('API-KEY', `${apiKey}`)
      .set('AUTHORIZATION', `${authorization}`);
    expect(response.status).toBe(400);
  });

  it('should return status 400 - GET /', async () => {
    const response = await supertest(global.server)
      .get(`${urlBase}/find?dt_start=ddd&dt_finish=ddd&page={page}`)
      .set('API-KEY', `${apiKey}`)
      .set('AUTHORIZATION', `${authorization}`);
    expect(response.status).toBe(400);
  });

  it('should return status 400 - GET /', async () => {
    const response = await supertest(global.server)
      .get(`${urlBase}/find?dt_start=ddd&dt_finish=${dt_finish}&page=1`)
      .set('API-KEY', `${apiKey}`)
      .set('AUTHORIZATION', `${authorization}`);
    expect(response.status).toBe(400);
  });

  it('should return status 400 - GET /', async () => {
    const response = await supertest(global.server)
      .get(`${urlBase}/find?dt_start=${dt_start}&dt_finish=ddd&page=1`)
      .set('API-KEY', `${apiKey}`)
      .set('AUTHORIZATION', `${authorization}`);
    expect(response.status).toBe(400);
  });

  it('should return status 400 - GET /', async () => {
    const response = await supertest(global.server)
      .get(`${urlBase}/find?dt_start=${dt_finish}&dt_finish=${dt_start}&page=1`)
      .set('API-KEY', `${apiKey}`)
      .set('AUTHORIZATION', `${authorization}`);
    expect(response.status).toBe(400);
  });

  it('should return status 400 - GET /', async () => {
    const response = await supertest(global.server)
      .get(`${urlBase}/find?dt_start=${dt_start}&dt_finish=2023-11-31 11:00:00&page=1`)
      .set('API-KEY', `${apiKey}`)
      .set('AUTHORIZATION', `${authorization}`);
    expect(response.status).toBe(400);
  });

  it('should return status 400 - GET /', async () => {
    const response = await supertest(global.server)
      .get(`${urlBase}/find?dt_start=2022-11-31 12:00:00&dt_finish=${dt_finish}&page=1`)
      .set('API-KEY', `${apiKey}`)
      .set('AUTHORIZATION', `${authorization}`);
    expect(response.status).toBe(400);
  });

  it('should return status 400 - GET /', async () => {
    const response = await supertest(global.server)
      .get(`${urlBase}/find?dt_start=2023-10-20 12:61:00&dt_finish=2023-11-20 35:00:00&page=2`)
      .set('API-KEY', `${apiKey}`)
      .set('AUTHORIZATION', `${authorization}`);
    expect(response.status).toBe(400);
  });

  it('should return status 400 - GET /', async () => {
    const response = await supertest(global.server)
      .get(`${urlBase}/find?dt_start=${dt_start}&dt_finish=${dt_finish}&page=xxx`)
      .set('API-KEY', `${apiKey}`)
      .set('AUTHORIZATION', `${authorization}`);
    expect(response.status).toBe(400);
  });
});

describe('LogErrors Endpoints Check Authorization', () => {
  it('should return status 401 - GET /', async () => {
    const response = await supertest(global.server).get(`${urlBase}/`);
    expect(response.status).toBe(401);
  });

  it('should return status 401 - GET /', async () => {
    const response = await supertest(global.server).get(`${urlBase}/`).set('API-KEY', `${constantUtil.Port}`);
    expect(response.status).toBe(401);
  });

  it('should return status 401 - GET /', async () => {
    const response = await supertest(global.server).get(`${urlBase}/`).set('API-KEY', `${apiKey}`);
    expect(response.status).toBe(401);
  });

  it('should return status 401 - GET /', async () => {
    const response = await supertest(global.server)
      .get(`${urlBase}/`)
      .set('API-KEY', '')
      .set('AUTHORIZATION', `${authorization}`);
    expect(response.status).toBe(401);
  });

  it('should return status 401 - GET /', async () => {
    const response = await supertest(global.server)
      .get(`${urlBase}/`)
      .set('API-KEY', '')
      .set('AUTHORIZATION', '');
    expect(response.status).toBe(401);
  });
});

describe('LogErrors Endpoints Check NotFound', () => {
  it('should return status 404 - GET /', async () => {
    const response = await supertest(global.server)
      .get(`${urlBase}/find?id_log_error=2000`)
      .set('API-KEY', `${apiKey}`)
      .set('AUTHORIZATION', `${authorization}`);
    expect(response.status).toBe(404);
  });

  it('should return status 404 - GET /', async () => {
    const response = await supertest(global.server)
      .get(`${urlBase}/find?dt_start=2023-01-01 12:00:00&dt_finish=2023-01-20 12:00:00&page=1`)
      .set('API-KEY', `${apiKey}`)
      .set('AUTHORIZATION', `${authorization}`);
    expect(response.status).toBe(404);
  });

  it('should return status 404 - GET /', async () => {
    const response = await supertest(global.server)
      .get(`${urlBase}/find?dt_start=${dt_start}&dt_finish=${dt_finish}&page=150`)
      .set('API-KEY', `${apiKey}`)
      .set('AUTHORIZATION', `${authorization}`);
    expect(response.status).toBe(404);
  });
});

describe('LogErrors Endpoints Check OK', () => {
  it('should return status 200 - GET /', async () => {
    const response = await supertest(global.server)
      .get(`${urlBase}/find?id_log_error=1`)
      .set('API-KEY', `${apiKey}`)
      .set('AUTHORIZATION', `${authorization}`);
    expect(response.status).toBe(200);
  });

  it('should return status 200 - GET /', async () => {
    const response = await supertest(global.server)
      .get(`${urlBase}/find?dt_start=${dt_start}&dt_finish=${dt_finish}&page=1`)
      .set('API-KEY', `${apiKey}`)
      .set('AUTHORIZATION', `${authorization}`);
    expect(response.status).toBe(200);
  });
});
