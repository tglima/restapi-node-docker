import supertest from 'supertest';

describe('health-check Endpoint', () => {
  it('should return status 200', async () => {
    const response = await supertest(global.server).get('/health-check');
    expect(response.status).toBe(200);
  });
});
