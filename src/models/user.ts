import Client from '../database';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config()

export type User = {
  id?: number;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
};

export class UserStore {
  // TODO: index
  async index(): Promise<User[]> {
    try {
      const connection = await Client.connect()
      const sql = 'SELECT * FROM users;'
      const result = await connection.query(sql)
      connection.release()
      return result.rows
    } catch (err) {
      throw new Error(`Cannot get users: ${err}`);
    }
  }
  // TODO: show
  async show(id: number): Promise<User> {
    try {
      const connection = await Client.connect()
      const sql = 'SELECT * FROM users WHERE id = ($1)'
      const result = await connection.query(sql, [id])
      const user = result.rows[0]
      connection.release()
      return user
    } catch (err) {
      throw new Error(`Cannot get user: ${err}`);
    }
  }
  // TODO: create
  async create(user: User): Promise<User> {
    try {
      const connection = await Client.connect()
      const sql = 'INSERT INTO users (username, first_name, last_name, password) VALUES ($1, $2, $3, $4)'
      const hashedPassword = bcrypt.hashSync(user.password + process.env.PEPPER, parseInt(process.env.SALT_ROUNDS as unknown as string))
      const result = await connection.query(sql, [user.username, user.firstName, user.lastName, hashedPassword])
      const newUser = result.rows[0]
      connection.release()
      return newUser
    } catch (err) {
      throw new Error(`Cannot create user: ${err}`); 
    }
  }
  // TODO: authenticate
}
