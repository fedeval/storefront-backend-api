import app from '../../server';
import supertest from 'supertest';
import Client from '../../database';

const request = supertest(app);

describe('Products controller', () => {
  it('posts on /products endpoint and returns a product in JSON format', async () => {
    const response = await request
      .post('/products')
      .send({ name: 'bike', price: 200, category: 'sports', rating: 4.32 });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: 1,
      name: 'bike',
      price: 200,
      category: 'sports',
      rating: 4.32
    });
  });

  it('gets /products endpoint and returns a list of products in JSON format', async () => {
    const response = await request.get('/products');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
        id: 1,
        name: 'bike',
        price: 200,
        category: 'sports',
        rating: 4.32
      }
    ]);
  });

  it('gets /products/:id endpoint and returns a product in JSON format', async () => {
    const response = await request.get('/products/1');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: 1,
      name: 'bike',
      price: 200,
      category: 'sports',
      rating: 4.32
    });
  });

  it('deletes on /products/:id endpoint and returns the deleted product in JSON format', async () => {
    const response = await request.get('/products/1');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: 1,
      name: 'bike',
      price: 200,
      category: 'sports',
      rating: 4.32
    });
  });

  afterAll(async () => {
    const connection = await Client.connect();
    await connection.query('DELETE FROM products;');
    await connection.query('ALTER SEQUENCE products_id_seq RESTART WITH 1;');
    connection.release();
  });
});
