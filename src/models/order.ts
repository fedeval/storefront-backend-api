import Client from '../database';
import { columnNamesToOrderProps } from '../utils/namingConventions';

export type Order = {
  id?: number;
  userId: number;
  currentStatus: string;
};

export class OrderStore {
  async create(userId: number): Promise<Order> {
    try {
      const connection = await Client.connect();
      const checkActiveQuery = "SELECT id FROM orders WHERE user_id = ($1) AND current_status = 'active';"
      const checkActiveQueryRes = await connection.query(checkActiveQuery, [userId])
      if (checkActiveQueryRes.rows[0]) {
        connection.release()
        throw new Error("an active order for this user already exists");
      } else {
        const sql =
          'INSERT INTO orders (user_id, current_status) VALUES ($1, $2) RETURNING *;';
        const result = await connection.query(sql, [
          userId,
          'active'
        ]);
        const { id, user_id, current_status } = result.rows[0];
        connection.release();
        return columnNamesToOrderProps(id, Number(user_id), current_status);
      }
    } catch (err) {
      throw new Error(`Cannot create order: ${err.message}`);
    }
  }
  // TODO: update order status
  // TODO: active order per user
  // TODO: completed orders per user
}
