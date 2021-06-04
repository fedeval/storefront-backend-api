import { Product, ProductStore } from '../models/product';

const store = new ProductStore()

describe('Testing Product model', () => {
  it('Has an index method', () => {
    expect(store.index).toBeDefined()
  })
  it('Has a show method', () => {
    expect(store.show).toBeDefined()
  })
  it('Has a create method', () => {
    expect(store.create).toBeDefined()
  })
  it('Has a topfive method', () => {
    expect(store.topfive).toBeDefined()
  })
})