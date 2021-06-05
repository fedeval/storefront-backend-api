import { Order, OrderStore } from '../models/order';
import { UserStore } from '../models/user';
import { userList } from './helpers/userTestData';
import Client from '../database';

const orderStore = new OrderStore();
const userStore = new UserStore();

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
    await userStore.create(userList[0]);
  });

  // TODO: test create functionality
  it('create should add an order', async () => {
    const testOrder: Order = { userId: 1, currentStatus: 'active'}
    const result = await orderStore.create(testOrder);
    expect(result).toEqual({
      id: 1,
      userId: 1,
      currentStatus: 'active'
    });
  });
  // TODO: test update functionality
  // TODO: test active functionality
  // TODO: test completed functionality
  afterAll(async() => {
    const connection = await Client.connect()
    await connection.query('DELETE FROM users;')
    await connection.query('ALTER SEQUENCE users_id_seq RESTART WITH 1;')
    await connection.query('DELETE FROM orders;')
    await connection.query('ALTER SEQUENCE orders_id_seq RESTART WITH 1;')
    connection.release()
  })
});
