import { UserStore } from '../models/user';
// import { Product, ProductStore } from '../models/product';
// import { Order, OrderStore } from '../models/order';
import { userList, userListWithIdAndNoPwd } from './helpers/userTestData'
import Client from '../database'
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import _ from 'lodash';

dotenv.config();
const { PEPPER, SALT_ROUNDS } = process.env;

const store = new UserStore();

describe('User model', () => {
  it('has an index method', () => {
    expect(store.index).toBeDefined();
  });

  it('has a show method', () => {
    expect(store.show).toBeDefined();
  });

  it('has a create method', () => {
    expect(store.create).toBeDefined();
  });

  it('has an authenticate method', () => {
    expect(store.authenticate).toBeDefined();
  });

});

describe('User model method', () => {
  beforeAll(async () => {
    const connection = await Client.connect()
    const sql = 'INSERT INTO users (username, first_name, last_name, password) VALUES ($1, $2, $3, $4);'
    
    for (const user of userList) {
      const hashedPassword = bcrypt.hashSync(
        user.password + PEPPER,
        parseInt(SALT_ROUNDS as unknown as string)
      );
      await connection.query(sql,[user.username, user.firstName, user.lastName, hashedPassword]);
    }

    connection.release()
  });
  
  it('index should return a list of all users', async () => {
    const result = await store.index();
    const resultWithoutPwd = result.map((user) => {
      return _.pick(user, ['id', 'username', 'firstName', 'lastName']);
    });
    expect(resultWithoutPwd).toEqual(userListWithIdAndNoPwd);
  });
  
  it('create should add a user', async () => {
    const result = await store.create({
      username: 'testuser4',
      firstName: 'Roger',
      lastName: 'Taylor',
      password: 'testpwd4'
    });
    const resultWithoutPwd = _.pick(result, [
      'id',
      'username',
      'firstName',
      'lastName'
    ]);
    expect(resultWithoutPwd).toEqual({
      id: 4,
      username: 'testuser4',
      firstName: 'Roger',
      lastName: 'Taylor'
    });
  });
  
  it('show should return the user with the given id', async () => {
    const result = await store.show(4);
    const resultWithoutPwd = _.pick(result, [
      'id',
      'username',
      'firstName',
      'lastName'
    ]);
    expect(resultWithoutPwd).toEqual({
      id: 4,
      username: 'testuser4',
      firstName: 'Roger',
      lastName: 'Taylor'
    });
  });
  
  it('authenticate should return null for the wrong user and password combination', async () => {
    const result = await store.authenticate('testuser1', 'testpwd2');
    expect(result).toBe(null);
  });
  
  it('authenticate should return a user for the right user and password combination', async () => {
    const result = await store.authenticate('testuser1', 'testpwd1');
    const resultWithoutPwd = _.pick(result, [
      'id',
      'username',
      'firstName',
      'lastName'
    ]);
    expect(resultWithoutPwd).toEqual(userListWithIdAndNoPwd[0]);
  });

  afterAll(async() => {
    const connection = await Client.connect()
    await connection.query('DELETE FROM users;')
    await connection.query('ALTER SEQUENCE users_id_seq RESTART WITH 1;')
    connection.release()
  })
})


describe('User can modify orders', () => {
  // const testUser = userList[0];
  // const testProduct = {
  //   name: 'notepad',
  //   price: 9,
  //   category: 'office',
  //   rating: 4.2
  // };
  // const testOrder1 = {
  //   userId: 1,
  //   currentStatus: 'active'
  // };
  // const testOrder2 = {
  //   userId: 1,
  //   currentStatus: 'completed'
  // };
  // const productStore = new ProductStore();
  // const orderStore = new OrderStore();

  // beforeAll(async () => {
  //   await store.create(testUser);
  //   await productStore.create(testProduct);
  // });

  it('with an addProductToOrder method', () => {
    expect(store.addProductToOrder).toBeDefined();
  });
  // TODO: test removeproductfromorder definition
  // TODO: test addtoproductf unctionality
  // TODO: test removeproductfromorder functionality
});
