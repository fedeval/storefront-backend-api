"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const order_1 = require("../models/order");
const user_1 = require("../models/user");
const orderTestData_1 = require("./helpers/orderTestData");
const userTestData_1 = require("./helpers/userTestData");
const database_1 = __importDefault(require("../database"));
const orderStore = new order_1.OrderStore();
const userStore = new user_1.UserStore();
describe('Order model', () => {
    it('has a create method', () => {
        expect(orderStore.create).toBeDefined();
    });
    /*
    it('has a update method', () => {
      expect(orderStore.update).toBeDefined()
    })
  
    it('has an active method', () => {
      expect(orderStore.active).toBeDefined()
    })
  
  
    it('has a completed method', () => {
      expect(orderStore.completed).toBeDefined()
    })
    */
});
describe('Order model method', () => {
    beforeAll(async () => {
        await userStore.create(userTestData_1.userList[0]);
    });
    it('create should add an order', async () => {
        const result = await orderStore.create(orderTestData_1.testOrder);
        expect(result).toEqual({
            id: 1,
            userId: 1,
            currentStatus: 'active'
        });
    });
    // TODO: test update functionality
    // TODO: test active functionality
    // TODO: test completed functionality
    afterAll(async () => {
        const connection = await database_1.default.connect();
        await connection.query('DELETE FROM users;');
        await connection.query('ALTER SEQUENCE users_id_seq RESTART WITH 1;');
        await connection.query('DELETE FROM orders;');
        await connection.query('ALTER SEQUENCE orders_id_seq RESTART WITH 1;');
        connection.release();
    });
});
