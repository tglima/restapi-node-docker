import supertest from 'supertest';

const urlBase = `/swagger`;
const urlBaseMng = '/swagger-manager';

describe('Swagger site', () => {
  it('should return status 302 - GET /', async () => {
    const response = await supertest(global.server).get('/');
    expect(response.status).toBe(302);
  });

  it('should return status 200 - GET /swagger.json', async () => {
    const response = await supertest(global.server).get(`${urlBase}.json`);
    expect(response.status).toBe(200);
  });

  it('should return status 200 - GET /swagger/#/Product', async () => {
    const response = await supertest(global.server).get(`${urlBase}/#/Product`);
    expect(response.status).toBe(200);
  });

  it('should return status 200 - GET /swagger/#/Product/FindAllProducts', async () => {
    const response = await supertest(global.server).get(`${urlBase}/#/Product/FindAllProducts`);
    expect(response.status).toBe(200);
  });

  it('should return status 200 - GET /swagger/#/Product/FindProductById', async () => {
    const response = await supertest(global.server).get(`${urlBase}/#/Product/FindProductById`);
    expect(response.status).toBe(200);
  });
});

describe('Swagger Manager site', () => {
  it('should return status 200 - GET /swagger-manager.json', async () => {
    const response = await supertest(global.server).get(`${urlBaseMng}.json`);
    expect(response.status).toBe(200);
  });

  it('should return status 200 - GET /swagger-manager/#/LogEvent', async () => {
    const response = await supertest(global.server).get(`${urlBaseMng}/#/LogEvent`);
    expect(response.status).toBe(200);
  });

  it('should return status 200 - GET /swagger/#/LogError', async () => {
    const response = await supertest(global.server).get(`${urlBaseMng}/#/LogError`);
    expect(response.status).toBe(200);
  });

  it('should return status 200 - GET /swagger/#/Database', async () => {
    const response = await supertest(global.server).get(`${urlBaseMng}/#/Database`);
    expect(response.status).toBe(200);
  });
});
