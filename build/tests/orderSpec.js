"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const order_1 = require("../models/order");
const user_1 = require("../models/user");
const orderStore = new order_1.OrderStore();
const userStore = new user_1.UserStore();
describe('Testing order model', () => {
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
    beforeAll(async () => {
        await userStore.create({
            username: 'testuser1',
            firstName: 'Freddie',
            lastName: 'Mercury',
            password: 'testpwd1'
        });
    });
    // TODO: test create functionality
    it('create should add an order', async () => {
        const result = await orderStore.create({
            userId: 1,
            currentStatus: 'active'
        });
        expect(result).toBe({
            id: 1,
            userId: 1,
            currentStatus: 'active'
        });
    });
    // TODO: test update functionality
    // TODO: test active functionality
    // TODO: test completed functionality
});
