import Client from '../database';

export type Product = {
  id?: number,
  name: string,
  price: number,
  category: string,
  rating: number
}

export class ProductStore {
  // TODO: index action + category param (optional)
  // TODO: show action
  // TODO: create action
  // TODO: topfive action
}