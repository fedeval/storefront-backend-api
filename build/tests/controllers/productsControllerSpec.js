"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("../../server"));
const supertest_1 = __importDefault(require("supertest"));
const database_1 = __importDefault(require("../../database"));
const jwtAuthentication_1 = require("../../utils/jwtAuthentication");
/*
Create a dummy token to test enpoints that require authentication
*/
const token = jwtAuthentication_1.createAuthToken('test');
const request = supertest_1.default(server_1.default);
describe('Products controller', () => {
    it('posts /products: returns a product in JSON format', async () => {
        const response = await request
            .post('/products')
            .set('Authorization', `Bearer ${token}`)
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
    it('gets /products: returns a list of products in JSON format', async () => {
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
    it('gets /products/:id: returns a product in JSON format', async () => {
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
    it('deletes /products/:id: returns the deleted product in JSON format', async () => {
        const response = await request.delete('/products/1').set('Authorization', `Bearer ${token}`);
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
        const connection = await database_1.default.connect();
        await connection.query('DELETE FROM products;');
        await connection.query('ALTER SEQUENCE products_id_seq RESTART WITH 1;');
        connection.release();
    });
});
