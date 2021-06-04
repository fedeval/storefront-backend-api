import Client from '../database';

export type Order = {
  id?: number;
  userId: number;
  currentStatus: string;
};

export class OrderStore {
  // TODO: create
  // TODO: active order per user
  // TODO: completed orders per user
}
