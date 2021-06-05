import { OrderStore } from '../models/order';
import { UserStore } from '../models/user';
import { testOrder } from './helpers/orderTestData';
import { userList } from './helpers/userTestData';
import Client from '../database';

const orderStore = new OrderStore();
const userStore = new UserStore();

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
    await userStore.create(userList[0]);
  });

  it('create should add an order', async () => {
    const result = await orderStore.create(1);
    expect(result).toEqual({
      id: 1,
      userId: 1,
      currentStatus: 'active'
    });
  });

  it('create should throw an error if an active order already exist with the same user id', async() => {
    let error;
    try {
      const result = await orderStore.create(1)
    } catch (err) {
      error = err.message
    }
    expect(error).toEqual('Cannot create order: an active order for this user already exists')
  })
  // TODO: test update functionality
  // TODO: test active functionality
  // TODO: test completed functionality

  afterAll(async () => {
    const connection = await Client.connect();
    await connection.query('DELETE FROM users;');
    await connection.query('ALTER SEQUENCE users_id_seq RESTART WITH 1;');
    await connection.query('DELETE FROM orders;');
    await connection.query('ALTER SEQUENCE orders_id_seq RESTART WITH 1;');
    connection.release();
  });
});
