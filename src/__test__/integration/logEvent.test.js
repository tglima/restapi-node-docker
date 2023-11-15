import moment from 'moment-timezone';
import supertest from 'supertest';
import utils from '../../app/utils';
import constantUtil from '../../app/utils/constant.util';

const urlBase = `/v${constantUtil.NuVersionAPI}/mng/log-events`;
const apiKey = constantUtil.ApiKey;
const authorization = constantUtil.MngKeyAuth;
const dt_finish = utils.getDateNow();
const dt_start = moment(dt_finish).subtract(1, 'hours').format(constantUtil.MomentDateFormat);

describe('LogEvents Endpoints Check BadRequest', () => {
  it('should return status 400 - GET /', async () => {
    const response = await supertest(global.server)
      .get(`${urlBase}/find?x=ddddd`)
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
      .get(`${urlBase}/find?dt_start=ddd&dt_finish=2023-11-2000 12:00:00&page=1`)
      .set('API-KEY', `${apiKey}`)
      .set('AUTHORIZATION', `${authorization}`);
    expect(response.status).toBe(400);
  });

  it('should return status 400 - GET /', async () => {
    const response = await supertest(global.server)
      .get(`${urlBase}/find?dt_start=2023-11-2000 12:00:00&dt_finish=ddd&page=1`)
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

describe('LogEvents Endpoints Check Authorization', () => {
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

describe('LogEvents Endpoints Check NotFound', () => {
  it('should return status 404 - GET /', async () => {
    const response = await supertest(global.server)
      .get(`${urlBase}/find?code_event==b000b00a-ab00-0000-b000-bb000b000000`)
      .set('API-KEY', `${apiKey}`)
      .set('AUTHORIZATION', `${authorization}`);
    expect(response.status).toBe(404);
  });

  it('should return status 404 - GET /', async () => {
    const response = await supertest(global.server)
      .get(`${urlBase}/find?api_key=${apiKey}9`)
      .set('API-KEY', `${apiKey}`)
      .set('AUTHORIZATION', `${authorization}`);
    expect(response.status).toBe(404);
  });

  it('should return status 404 - GET /', async () => {
    const response = await supertest(global.server)
      .get(`${urlBase}/find?api_key=${apiKey}&page=300`)
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
});

describe('LogEvents Endpoints Check OK', () => {
  it('should return status 200 - GET /', async () => {
    const response = await supertest(global.server)
      .get(`${urlBase}/find?api_key=${apiKey}&page=1`)
      .set('API-KEY', `${apiKey}`)
      .set('AUTHORIZATION', `${authorization}`);
    expect(response.status).toBe(200);
  });

  it('should return status 200 - GET /', async () => {
    // Procuro na tabela log_event os registros com a api_key
    // que esta no env. Recupero assim um code_event gerado
    // durante os testes e utilizo ele para fazer a pesquisa
    const resp = await supertest(global.server)
      .get(`${urlBase}/find?api_key=${apiKey}&page=1`)
      .set('API-KEY', `${apiKey}`)
      .set('AUTHORIZATION', `${authorization}`);

    const { code_event } = resp.body.log_events[0];

    const response = await supertest(global.server)
      .get(`${urlBase}/find?code_event=${code_event}`)
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
