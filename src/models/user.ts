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

// SQL and JS have different naming conventions:
// - lower_snake_case: SQL columns
// - camelCase: JS object properties
// To avoid breaking conventions we can use this function to convert from SQL naming to JS when importing data from the DB
const convertColNamesToUserProps = (id: number, username: string, first_name: string, last_name: string, password: string): User => {
  const user: User = {
    id: id,
    username: username,
    firstName: first_name,
    lastName: last_name,
    password: password
  }
  return user
}

export class UserStore {
  // TODO: index
  async index(): Promise<User[]> {
    try {
      const connection = await Client.connect()
      const sql = 'SELECT * FROM users;'
      const result = await connection.query(sql)
      connection.release()
      console.log(typeof result.rows[0])
      return result.rows.map((dbData) => {
        return convertColNamesToUserProps(dbData.id, dbData.username, dbData.first_name, dbData.last_name, dbData.password)
      })
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
      const { dbId, username, first_name, last_name, password } = result.rows[0]
      connection.release()
      return convertColNamesToUserProps(dbId, username, first_name, last_name, password)
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
      const { dbId, username, first_name, last_name, password } = result.rows[0]
      connection.release()
      return convertColNamesToUserProps(dbId, username, first_name, last_name, password)
    } catch (err) {
      throw new Error(`Cannot create user ${user.username}: ${err}`); 
    }
  }
  // TODO: authenticate
  async authenticate(username: string, password: string): Promise<null | User> {
    try {
      const connection = await Client.connect()
      const sql = 'SELECT * FROM users WHERE username=($1)'
      const result = await connection.query(sql,[username])
      let auth: null| User = null
      if (result.rows.length) {
        const { dbId, username, first_name, last_name, dbPassword } = result.rows[0]
        const user: User = convertColNamesToUserProps(dbId, username, first_name, last_name, dbPassword)
        if (bcrypt.compareSync(password + process.env.PEPPER, user.password)) {
          auth = user
        }
      }
      return auth
    } catch (err) {
      throw new Error(`Cannot authenticate user ${username}: ${err}`);
    }
  }
}
