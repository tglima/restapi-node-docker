import supertest from 'supertest';
import constantUtil from '../../app/utils/constant.util';

const urlBase = `/v${constantUtil.NuVersionAPI}/products/find`;
const apiKey = process.env.API_KEY;

describe('Product Endpoints', () => {
  it('should return status 401 - GET /products/find', async () => {
    const response = await supertest(global.server).get(urlBase);
    expect(response.status).toBe(401);
  });

  it('should return status 401 - GET /products/find', async () => {
    const response = await supertest(global.server).get(urlBase).set('API-KEY', `${constantUtil.Port}`);
    expect(response.status).toBe(401);
  });

  it('should return status 401 - GET /products/find?id={id}', async () => {
    const response = await supertest(global.server)
      .get(`${urlBase}?id=3`)
      .set('API-KEY', `${constantUtil.Port}`);
    expect(response.status).toBe(401);
  });

  it('should return status 200 - GET /products/find', async () => {
    const response = await supertest(global.server).get(urlBase).set('api-key', `${apiKey}`);
    expect(response.status).toBe(200);
  });

  it('should return status 200 - GET /products/find?id={id}', async () => {
    const response = await supertest(global.server).get(`${urlBase}?id=3`).set('API-KEY', `${apiKey}`);
    expect(response.status).toBe(200);
  });

  it('should return status 400 - GET /products/find?id={id}', async () => {
    const response = await supertest(global.server).get(`${urlBase}?id=33`).set('API-KEY', `${apiKey}`);
    expect(response.status).toBe(400);
  });

  it('should return status 400 - GET /products/find?code={id}', async () => {
    const response = await supertest(global.server).get(`${urlBase}?code=33`).set('API-KEY', `${apiKey}`);
    expect(response.status).toBe(400);
  });
});
