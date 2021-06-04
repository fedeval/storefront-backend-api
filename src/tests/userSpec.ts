import { User, UserStore } from '../models/user';
import dotenv from 'dotenv';
import _ from 'lodash';

dotenv.config();

const store = new UserStore();
export const userList: User[] = [
  {
    username: 'testuser1',
    firstName: 'Freddie',
    lastName: 'Mercury',
    password: 'testpwd1'
  },
  {
    username: 'testuser2',
    firstName: 'Brian',
    lastName: 'May',
    password: 'testpwd2'
  },
  {
    username: 'testuser3',
    firstName: 'John',
    lastName: 'Deacon',
    password: 'testpwd3'
  }
];

// Add ids and strip passwords to make test comparisons simpler
const userListWithIdAndNoPwd = userList.map((user, index) => {
  return {
    id: index + 1,
    ..._.pick(user, ['username', 'firstName', 'lastName'])
  };
});

describe('Testing user model', () => {
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

  beforeAll(async () => {
    for (const user of userList) {
      await store.create(user);
    }
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
});
