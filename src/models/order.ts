import Client from '../database';
import { columnNamesToOrderProps } from '../utils/namingConventions';

export type Order = {
  id?: number;
  userId: number;
  currentStatus: string;
};

export class OrderStore {
  // TODO: create
  async create(order: Order): Promise<Order> {
    try {
      const connection = await Client.connect();
      const sql =
        'INSERT INTO orders (user_id, current_status) VALUES ($1, $2) RETURNING *;';
      const result = await connection.query(sql, [
        order.userId,
        order.currentStatus
      ]);
      const { id, order_id, current_status } = result.rows[0];
      connection.release();
      return columnNamesToOrderProps(id, order_id, current_status);
    } catch (err) {
      throw new Error(`Cannot create order: ${err}`);
    }
  }
  // TODO: active order per user
  // TODO: completed orders per user
}
