import Client from '../database';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { convertColNamesToUserProps } from '../utils/namingConventions';

dotenv.config();

const { PEPPER, SALT_ROUNDS } = process.env;

export type User = {
  id?: number;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
};

export class UserStore {
  async index(): Promise<User[]> {
    try {
      const connection = await Client.connect();
      const sql = 'SELECT * FROM users;';
      const result = await connection.query(sql);
      connection.release();
      return result.rows.map((dbData) => {
        return convertColNamesToUserProps(
          dbData.id,
          dbData.username,
          dbData.first_name,
          dbData.last_name,
          dbData.password
        );
      });
    } catch (err) {
      throw new Error(`Cannot get users: ${err}`);
    }
  }

  async show(userId: number): Promise<User> {
    try {
      const connection = await Client.connect();
      const sql = 'SELECT * FROM users WHERE id = ($1);';
      const result = await connection.query(sql, [userId]);
      const { id, username, first_name, last_name, password } = result.rows[0];
      connection.release();
      return convertColNamesToUserProps(
        id,
        username,
        first_name,
        last_name,
        password
      );
    } catch (err) {
      throw new Error(`Cannot get user: ${err}`);
    }
  }

  async create(user: User): Promise<User> {
    try {
      const connection = await Client.connect();
      const sql =
        'INSERT INTO users (username, first_name, last_name, password) VALUES ($1, $2, $3, $4) RETURNING *;';
      const hashedPassword = bcrypt.hashSync(
        user.password + PEPPER,
        parseInt(SALT_ROUNDS as unknown as string)
      );
      const result = await connection.query(sql, [
        user.username,
        user.firstName,
        user.lastName,
        hashedPassword
      ]);
      const { id, username, first_name, last_name, password } = result.rows[0];
      connection.release();
      return convertColNamesToUserProps(
        id,
        username,
        first_name,
        last_name,
        password
      );
    } catch (err) {
      throw new Error(`Cannot create user ${user.username}: ${err}`);
    }
  }

  async authenticate(
    username: string,
    pwdString: string
  ): Promise<null | User> {
    try {
      const connection = await Client.connect();
      const sql = 'SELECT * FROM users WHERE username=($1);';
      const result = await connection.query(sql, [username]);
      let auth: null | User = null;
      if (result.rows.length) {
        const { id, username, first_name, last_name, password } =
          result.rows[0];
        const user: User = convertColNamesToUserProps(
          id,
          username,
          first_name,
          last_name,
          password
        );
        if (bcrypt.compareSync(pwdString + PEPPER, user.password)) {
          auth = user;
        }
      }
      return auth;
    } catch (err) {
      throw new Error(`Cannot authenticate user ${username}: ${err}`);
    }
  }

  // TODO: add addproducttoorder
  // TODO: add removeproductfromorder
}
