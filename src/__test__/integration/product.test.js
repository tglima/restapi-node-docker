import supertest from 'supertest';

const { apiKey, authorization, urlProductFind } = require('../testUtil');

describe('Product Endpoints', () => {
  it('should return status 401 - GET /products/find', async () => {
    const response = await supertest(global.server).get(urlProductFind);
    expect(response.status).toBe(401);
  });

  it('should return status 401 - GET /products/find', async () => {
    const response = await supertest(global.server).get(urlProductFind).set('API-KEY', `${authorization}`);
    expect(response.status).toBe(401);
  });

  it('should return status 401 - GET /products/find?id={id}', async () => {
    const response = await supertest(global.server)
      .get(`${urlProductFind}?id=3`)
      .set('API-KEY', `${authorization}`)
      .set('AUTHORIZATION', '');
    expect(response.status).toBe(401);
  });

  it('should return status 200 - GET /products/find', async () => {
    const response = await supertest(global.server).get(urlProductFind).set('api-key', `${apiKey}`);
    expect(response.status).toBe(200);
  });

  it('should return status 200 - GET /products/find?id={id}', async () => {
    const response = await supertest(global.server).get(`${urlProductFind}?id=3`).set('API-KEY', `${apiKey}`);
    expect(response.status).toBe(200);
  });

  it('should return status 400 - GET /products/find?id={id}', async () => {
    const response = await supertest(global.server)
      .get(`${urlProductFind}?id=33`)
      .set('API-KEY', `${apiKey}`);
    expect(response.status).toBe(400);
  });

  it('should return status 400 - GET /products/find?code={id}', async () => {
    const response = await supertest(global.server)
      .get(`${urlProductFind}?code=33`)
      .set('API-KEY', `${apiKey}`);
    expect(response.status).toBe(400);
  });
});
