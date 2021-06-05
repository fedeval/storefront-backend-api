"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("../models/user");
const product_1 = require("../models/product");
const order_1 = require("../models/order");
const userTestData_1 = require("./helpers/userTestData");
const productTestData_1 = require("./helpers/productTestData");
const orderTestData_1 = require("./helpers/orderTestData");
const database_1 = __importDefault(require("../database"));
const dotenv_1 = __importDefault(require("dotenv"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const lodash_1 = __importDefault(require("lodash"));
dotenv_1.default.config();
const { PEPPER, SALT_ROUNDS } = process.env;
const store = new user_1.UserStore();
describe('User model', () => {
    it('has an index method', () => {
        expect(store.index).toBeDefined();
    });
    it('has a show method', () => {
        expect(store.show).toBeDefined();
    });
    it('has a create method', () => {
        expect(store.create).toBeDefined();
    });
    it('has an authenticate method', () => {
        expect(store.authenticate).toBeDefined();
    });
});
describe('User model method', () => {
    beforeAll(async () => {
        const connection = await database_1.default.connect();
        const sql = 'INSERT INTO users (username, first_name, last_name, password) VALUES ($1, $2, $3, $4);';
        for (const user of userTestData_1.userList) {
            const hashedPassword = bcrypt_1.default.hashSync(user.password + PEPPER, parseInt(SALT_ROUNDS));
            await connection.query(sql, [
                user.username,
                user.firstName,
                user.lastName,
                hashedPassword
            ]);
        }
        connection.release();
    });
    it('index should return a list of all users', async () => {
        const result = await store.index();
        const resultWithoutPwd = result.map((user) => {
            return lodash_1.default.pick(user, ['id', 'username', 'firstName', 'lastName']);
        });
        expect(resultWithoutPwd).toEqual(userTestData_1.userListWithIdAndNoPwd);
    });
    it('create should add a user', async () => {
        const result = await store.create({
            username: 'testuser4',
            firstName: 'Roger',
            lastName: 'Taylor',
            password: 'testpwd4'
        });
        const resultWithoutPwd = lodash_1.default.pick(result, [
            'id',
            'username',
            'firstName',
            'lastName'
        ]);
        expect(resultWithoutPwd).toEqual({
            id: 4,
            username: 'testuser4',
            firstName: 'Roger',
            lastName: 'Taylor'
        });
    });
    it('show should return the user with the given id', async () => {
        const result = await store.show(4);
        const resultWithoutPwd = lodash_1.default.pick(result, [
            'id',
            'username',
            'firstName',
            'lastName'
        ]);
        expect(resultWithoutPwd).toEqual({
            id: 4,
            username: 'testuser4',
            firstName: 'Roger',
            lastName: 'Taylor'
        });
    });
    it('authenticate should return null for the wrong user and password combination', async () => {
        const result = await store.authenticate('testuser1', 'testpwd2');
        expect(result).toBe(null);
    });
    it('authenticate should return a user for the right user and password combination', async () => {
        const result = await store.authenticate('testuser1', 'testpwd1');
        const resultWithoutPwd = lodash_1.default.pick(result, [
            'id',
            'username',
            'firstName',
            'lastName'
        ]);
        expect(resultWithoutPwd).toEqual(userTestData_1.userListWithIdAndNoPwd[0]);
    });
    afterAll(async () => {
        const connection = await database_1.default.connect();
        await connection.query('DELETE FROM users;');
        await connection.query('ALTER SEQUENCE users_id_seq RESTART WITH 1;');
        connection.release();
    });
});
describe('User can modify orders', () => {
    it('with an addProductToOrder method', () => {
        expect(store.addProductToOrder).toBeDefined();
    });
    it('with a removeProductFromOrder method', () => {
        expect(store.removeProductFromOrder).toBeDefined();
    });
});
describe('User method to modify orders', () => {
    const productStore = new product_1.ProductStore();
    const orderStore = new order_1.OrderStore();
    const testUser = userTestData_1.userList[0];
    const testProduct = productTestData_1.productList[0];
    beforeAll(async () => {
        await store.create(testUser);
        await productStore.create(testProduct);
        await orderStore.create(orderTestData_1.testOrder);
    });
    it('addProductToOrder adds a product to an active order', async () => {
        const result = await store.addProductToOrder(1, 1, 10);
        expect(result).toEqual({
            id: 1,
            productId: 1,
            quantity: 10,
            orderId: 1
        });
    });
    it('removeProductFromOrder returns the removed order details from an active order', async () => {
        const result = await store.removeProductFromOrder(1, 1);
        expect(result).toEqual({
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
