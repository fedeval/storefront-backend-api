import Client from '../database';

export type Product = {
  id?: number;
  name: string;
  price: number;
  category: string;
  rating: number;
};

export class ProductStore {
  // TODO: index action + category param (optional)
  async index(): Promise<Product[]> {
    try {
      const connection = await Client.connect();
      const sql = 'SELECT * FROM products;';
      const result = await connection.query(sql);
      connection.release();
      console.log(result.rows)
      return result.rows;
    } catch (err) {
      throw new Error(`Cannot get products: ${err}`);
    }
  }
  // TODO: show action
  async show(id: number): Promise<Product> {
    try {
      const connection = await Client.connect();
      const sql = 'SELECT * FROM products WHERE id = ($1);';
      const result = await connection.query(sql, [id]);
      const product = result.rows[0];
      connection.release();
      return product;
    } catch (err) {
      throw new Error(`Cannot get product: ${err}`);
    }
  }
  // TODO: create action
  async create(product: Product): Promise<Product> {
    try {
      const connection = await Client.connect();
      const sql =
        'INSERT INTO products (name, price, category, rating) VALUES ($1, $2, $3, $4) RETURNING *;';
      const result = await connection.query(sql, [
        product.name,
        product.price,
        product.category,
        product.rating
      ]);
      const newProduct = result.rows[0];
      connection.release();
      return newProduct;
    } catch (err) {
      throw new Error(`Cannot add product ${product.name}: ${err}`);
    }
  }
  // TODO: topfive action
  async delete(id: number): Promise<Product> {
    try {
      const connection = await Client.connect();
      const sql = 'DELETE FROM products WHERE id = ($1);';
      const result = await connection.query(sql, [id]);
      const deletedProduct = result.rows[0];
      connection.release();
      return deletedProduct;
    } catch (err) {
      throw new Error(`Cannot delete product: ${err}`);
    }
  }
}
