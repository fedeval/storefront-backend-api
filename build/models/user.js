"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserStore = void 0;
const database_1 = __importDefault(require("../database"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
const namingConventions_1 = require("../utils/namingConventions");
dotenv_1.default.config();
const { PEPPER, SALT_ROUNDS } = process.env;
class UserStore {
    async index() {
        try {
            const connection = await database_1.default.connect();
            const sql = 'SELECT * FROM users;';
            const result = await connection.query(sql);
            connection.release();
            return result.rows.map((dbData) => {
                return namingConventions_1.columnNamesToUserProps(dbData.id, dbData.username, dbData.first_name, dbData.last_name, dbData.password);
            });
        }
        catch (err) {
            throw new Error(`Cannot get users: ${err}`);
        }
    }
    async show(userId) {
        try {
            const connection = await database_1.default.connect();
            const sql = 'SELECT * FROM users WHERE id = ($1);';
            const result = await connection.query(sql, [userId]);
            const { id, username, first_name, last_name, password } = result.rows[0];
            connection.release();
            return namingConventions_1.columnNamesToUserProps(id, username, first_name, last_name, password);
        }
        catch (err) {
            throw new Error(`Cannot get user: ${err}`);
        }
    }
    async create(user) {
        try {
            const connection = await database_1.default.connect();
            const sql = 'INSERT INTO users (username, first_name, last_name, password) VALUES ($1, $2, $3, $4) RETURNING *;';
            const hashedPassword = bcrypt_1.default.hashSync(user.password + PEPPER, parseInt(SALT_ROUNDS));
            const result = await connection.query(sql, [
                user.username,
                user.firstName,
                user.lastName,
                hashedPassword
            ]);
            const { id, username, first_name, last_name, password } = result.rows[0];
            connection.release();
            return namingConventions_1.columnNamesToUserProps(id, username, first_name, last_name, password);
        }
        catch (err) {
            throw new Error(`Cannot create user ${user.username}: ${err}`);
        }
    }
    async authenticate(username, pwdString) {
        try {
            const connection = await database_1.default.connect();
            const sql = 'SELECT * FROM users WHERE username=($1);';
            const result = await connection.query(sql, [username]);
            let auth = null;
            if (result.rows.length) {
                const { id, username, first_name, last_name, password } = result.rows[0];
                const user = namingConventions_1.columnNamesToUserProps(id, username, first_name, last_name, password);
                if (bcrypt_1.default.compareSync(pwdString + PEPPER, user.password)) {
                    auth = user;
                }
            }
            return auth;
        }
        catch (err) {
            throw new Error(`Cannot authenticate user ${username}: ${err}`);
        }
    }
    async addProductToOrder(userId, productId, quantityInput) {
        try {
            const connection = await database_1.default.connect();
            const orderQuery = "SELECT id FROM orders WHERE user_id = ($1) AND current_status = 'active';";
            const orderResult = await connection.query(orderQuery, [userId]);
            const orderId = orderResult.rows[0].id;
            if (orderId) {
                const addProductQuery = 'INSERT INTO order_details (product_id, quantity, order_id) VALUES ($1, $2, $3) RETURNING *;';
                const result = await connection.query(addProductQuery, [
                    productId,
                    quantityInput,
                    orderId
                ]);
                const { id, product_id, quantity, order_id } = result.rows[0];
                connection.release();
                return namingConventions_1.columnNamesToOrderDetails(id, Number(product_id), quantity, Number(order_id));
            }
            else {
                connection.release();
                console.error(`There are no active orders for user ${userId}`);
            }
        }
        catch (err) {
            throw new Error(`Cannot add product ${productId} to order: ${err}`);
        }
    }
    async removeProductFromOrder(userId, productId) {
        try {
            const connection = await database_1.default.connect();
            const orderQuery = "SELECT id FROM orders WHERE user_id = ($1) AND current_status = 'active';";
            const orderResult = await connection.query(orderQuery, [userId]);
            const orderId = orderResult.rows[0].id;
            if (orderId) {
                const sql = 'DELETE FROM order_details WHERE order_id = ($1) AND product_id = ($2) RETURNING *;';
                const result = await connection.query(sql, [orderId, productId]);
                const { id, product_id, quantity, order_id } = result.rows[0];
                connection.release();
                return namingConventions_1.columnNamesToOrderDetails(id, Number(product_id), quantity, Number(order_id));
            }
            else {
                connection.release();
                console.error(`There are no active orders for user ${userId}`);
            }
        }
        catch (err) {
            throw new Error(`Could not delete product ${productId} from order: ${err}`);
        }
    }
}
exports.UserStore = UserStore;
