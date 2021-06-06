import app from '../../server';
import supertest from 'supertest';

const request = supertest(app);

describe('Products controller', () => {
  it('gets /products endpoint', async (done) => {
    const response = await request.get('/products');
    expect(response.status).toBe(200);
    done();
  });
});
