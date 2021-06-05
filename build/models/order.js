"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderStore = void 0;
const database_1 = __importDefault(require("../database"));
const namingConventions_1 = require("../utils/namingConventions");
class OrderStore {
    async create(userId) {
        try {
            const connection = await database_1.default.connect();
            const checkActiveQuery = "SELECT id FROM orders WHERE user_id = ($1) AND current_status = 'active';";
            const checkActiveQueryRes = await connection.query(checkActiveQuery, [userId]);
            if (checkActiveQueryRes.rows[0]) {
                connection.release();
                throw new Error("an active order for this user already exists");
            }
            else {
                const sql = 'INSERT INTO orders (user_id, current_status) VALUES ($1, $2) RETURNING *;';
                const result = await connection.query(sql, [
                    userId,
                    'active'
                ]);
                const { id, user_id, current_status } = result.rows[0];
                connection.release();
                return namingConventions_1.columnNamesToOrderProps(id, Number(user_id), current_status);
            }
        }
        catch (err) {
            throw new Error(`Cannot create order: ${err}`);
        }
    }
}
exports.OrderStore = OrderStore;
