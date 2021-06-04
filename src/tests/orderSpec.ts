import { Order, OrderStore } from '../models/order';
import { User, UserStore } from '../models/user'

const orderStore = new OrderStore()
const userStore = new UserStore()
const orderList: Order[] = [
  {
    userId: 1,
    currentStatus: 'completed'
  },
  {
    userId: 1,
    currentStatus: 'active'
  },
  {
    userId: 1,
    currentStatus: 'completed'
  }
]

describe('Testing order model', () => {
  it('has a create method', () => {
    expect(orderStore.create).toBeDefined()
  }) d

  it('has a delete method', () => {
    expect(orderStore.delete).toBeDefined()
  })

  it('has a current method', () => {
    expect(orderStore.current).toBeDefined()
  })

  it('has a completed method', () => {
    expect(orderStore.completed).toBeDefined()
  })

  beforeAll(async() => {
    await userStore.create({
      username: 'testuser1',
      firstName: 'Freddie',
      lastName: 'Mercury',
      password: 'testpwd1'
    })
    for(const order of orderList) {
      await orderStore.create(order)
    }
  })

  // TODO: test create functionality
  // TODO: test current functionality
  // TODO: test completed functionality
})