"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductStore = void 0;
const database_1 = __importDefault(require("../database"));
class ProductStore {
    // TODO: index action + category param (optional)
    async index() {
        try {
            const connection = await database_1.default.connect();
            const sql = 'SELECT * FROM products;';
            const result = await connection.query(sql);
            connection.release();
            return result.rows;
        }
        catch (err) {
            throw new Error(`Cannot get products: ${err}`);
        }
    }
    // TODO: show action
    async show(id) {
        try {
            const connection = await database_1.default.connect();
            const sql = 'SELECT * FROM products WHERE id = ($1);';
            const result = await connection.query(sql, [id]);
            const product = result.rows[0];
            connection.release();
            return product;
        }
        catch (err) {
            throw new Error(`Cannot get product: ${err}`);
        }
    }
    // TODO: create action
    async create(product) {
        try {
            const connection = await database_1.default.connect();
            const sql = 'INSERT INTO products (name, price, category, rating) VALUES ($1, $2, $3, $4) RETURNING *;';
            const result = await connection.query(sql, [
                product.name,
                product.price,
                product.category,
                product.rating
            ]);
            const newProduct = result.rows[0];
            connection.release();
            return newProduct;
        }
        catch (err) {
            throw new Error(`Cannot add product ${product.name}: ${err}`);
        }
    }
    // TODO: topfive action
    async delete(id) {
        try {
            const connection = await database_1.default.connect();
            const sql = 'DELETE FROM products WHERE id = ($1);';
            const result = await connection.query(sql, [id]);
            const deletedProduct = result.rows[0];
            connection.release();
            return deletedProduct;
        }
        catch (err) {
            throw new Error(`Cannot delete product: ${err}`);
        }
    }
}
exports.ProductStore = ProductStore;
