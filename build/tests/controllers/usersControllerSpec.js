"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userTestData_1 = require("../helpers/userTestData");
const product_1 = require("../../models/product");
const productTestData_1 = require("../helpers/productTestData");
const order_1 = require("../../models/order");
const server_1 = __importDefault(require("../../server"));
const supertest_1 = __importDefault(require("supertest"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const lodash_1 = __importDefault(require("lodash"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = __importDefault(require("../../database"));
const request = supertest_1.default(server_1.default);
dotenv_1.default.config();
const { PEPPER } = process.env;
describe('Users controller', () => {
    it('posts /users: returns a user in JSON format with a hashed password', async () => {
        const response = await request.post('/users').send(userTestData_1.userList[0]);
        const pwdCheck = bcrypt_1.default.compareSync(userTestData_1.userList[0].password + PEPPER, response.body.password);
        expect(response.status).toBe(200);
        expect(pwdCheck).toBe(true);
        expect(lodash_1.default.pick(response.body, ['id', 'username', 'firstName', 'lastName'])).toEqual(userTestData_1.userListWithIdAndNoPwd[0]);
    });
    it('gets /users: returns a list of users in JSON format with hashed passwords', async () => {
        const response = await request.get('/users');
        const returnedUsers = response.body.map((user) => {
            return lodash_1.default.pick(user, ['id', 'username', 'firstName', 'lastName']);
        });
        const pwdChecks = response.body.every((user, i) => {
            return bcrypt_1.default.compareSync(userTestData_1.userList[i].password + PEPPER, user.password);
        });
        expect(response.status).toBe(200);
        expect(returnedUsers).toEqual([userTestData_1.userListWithIdAndNoPwd[0]]);
        expect(pwdChecks).toBe(true);
    });
    it('gets /users/:id: returns a user in JSON format with a hashed password', async () => {
        const response = await request.get('/users/1');
        const pwdCheck = bcrypt_1.default.compareSync(userTestData_1.userList[0].password + PEPPER, response.body.password);
        expect(response.status).toBe(200);
        expect(pwdCheck).toBe(true);
        expect(lodash_1.default.pick(response.body, ['id', 'username', 'firstName', 'lastName'])).toEqual(userTestData_1.userListWithIdAndNoPwd[0]);
    });
    it('gets /auth: returns a user in JSON if the username/password combination is valid', async () => {
        const response = await request
            .get('/auth')
            .send({ username: userTestData_1.userList[0].username, password: userTestData_1.userList[0].password });
        const pwdCheck = bcrypt_1.default.compareSync(userTestData_1.userList[0].password + PEPPER, response.body.password);
        expect(response.status).toBe(200);
        expect(pwdCheck).toBe(true);
        expect(lodash_1.default.pick(response.body, ['id', 'username', 'firstName', 'lastName'])).toEqual(userTestData_1.userListWithIdAndNoPwd[0]);
    });
    it('gets /auth: returns an error message if the username/password combination is not valid', async () => {
        const response = await request
            .get('/auth')
            .send({ username: userTestData_1.userList[0].username, password: 'test' });
        expect(response.status).toBe(200);
        expect(response.body).toEqual({});
        expect(response.text).toEqual('Invalid username and/or password');
    });
    it('posts /users/:id/add-product-to-order: returns the order details', async () => {
        const productStore = new product_1.ProductStore();
        const orderStore = new order_1.OrderStore();
        await productStore.create(productTestData_1.productList[0]);
        await orderStore.create(1);
        const response = await request
            .post('/users/1/add-product-to-order')
            .send({ productId: 1, quantity: 10 });
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            id: 1,
            productId: 1,
            quantity: 10,
            orderId: 1
        });
    });
    it('deletes /users/:id/remove-product-from-order: returns the order details', async () => {
        const response = await request
            .delete('/users/1/remove-product-from-order')
            .send({ productId: 1 });
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            id: 1,
            productId: 1,
            quantity: 10,
            orderId: 1
        });
    });
    afterAll(async () => {
        const connection = await database_1.default.connect();
        await connection.query('DELETE FROM users;');
        await connection.query('ALTER SEQUENCE users_id_seq RESTART WITH 1;');
        await connection.query('DELETE FROM orders;');
        await connection.query('ALTER SEQUENCE orders_id_seq RESTART WITH 1;');
        await connection.query('DELETE FROM products;');
        await connection.query('ALTER SEQUENCE products_id_seq RESTART WITH 1;');
        await connection.query('DELETE FROM order_details;');
        await connection.query('ALTER SEQUENCE order_details_id_seq RESTART WITH 1;');
        connection.release();
    });
});
