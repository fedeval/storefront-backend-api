import { User, UserStore } from '../models/user';

const store = new UserStore();

describe('Testing user model', () => {
  it('has an index method', () => {
    expect(store.index).toBeDefined
  })

  it('has a show method', () => {
    expect(store.show).toBeDefined
  })

  it('has a create method', () => {
    expect(store.create).toBeDefined
  })
})