"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderStore = void 0;
const database_1 = __importDefault(require("../database"));
const namingConventions_1 = require("../utils/namingConventions");
class OrderStore {
    // TODO: create
    async create(order) {
        try {
            const connection = await database_1.default.connect();
            const sql = 'INSERT INTO orders (user_id, current_status) VALUES ($1, $2) RETURNING *;';
            const result = await connection.query(sql, [order.userId, order.currentStatus]);
            const { id, order_id, current_status } = result.rows[0];
            connection.release();
            return namingConventions_1.columnNamesToOrderProps(id, order_id, current_status);
        }
        catch (err) {
            throw new Error(`Cannot create order: ${err}`);
        }
    }
}
exports.OrderStore = OrderStore;
