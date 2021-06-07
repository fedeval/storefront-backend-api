"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("../../server"));
const supertest_1 = __importDefault(require("supertest"));
const user_1 = require("../../models/user");
const userTestData_1 = require("../helpers/userTestData");
const database_1 = __importDefault(require("../../database"));
const request = supertest_1.default(server_1.default);
describe('Orders controller', () => {
    beforeAll(async () => {
        const userStore = new user_1.UserStore();
        await userStore.create(userTestData_1.userList[0]);
    });
    it('posts on /orders: returns an active order in JSON format', async () => {
        const response = await request.post('/orders').send({ userId: 1 });
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            id: 1,
            userId: 1,
            currentStatus: 'active'
        });
    });
    it('gets /orders/users/:userId/active: returns an active order in JSON format', async () => {
        const response = await request.get('/orders/users/1/active');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            id: 1,
            userId: 1,
            currentStatus: 'active'
        });
    });
    it('puts /orders: returns a completed order in JSON format', async () => {
        const response = await request.put('/orders').send({ userId: 1 });
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            id: 1,
            userId: 1,
            currentStatus: 'complete'
        });
    });
    it('gets /orders/users/:userId/completed: returns a list of completed orders in JSON format', async () => {
        const response = await request.get('/orders/users/1/completed');
        expect(response.status).toBe(200);
        expect(response.body).toEqual([
            {
                id: 1,
                userId: 1,
                currentStatus: 'complete'
            }
        ]);
    });
    afterAll(async () => {
        const connection = await database_1.default.connect();
        await connection.query('DELETE FROM users;');
        await connection.query('ALTER SEQUENCE users_id_seq RESTART WITH 1;');
        await connection.query('DELETE FROM orders;');
        await connection.query('ALTER SEQUENCE orders_id_seq RESTART WITH 1;');
        connection.release();
    });
});
