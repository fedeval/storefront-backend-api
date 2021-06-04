"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserStore = void 0;
const database_1 = __importDefault(require("../database"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// SQL and JS have different naming conventions:
// - lower_snake_case: SQL columns
// - camelCase: JS object properties
// To avoid breaking conventions we can use this function to convert from SQL naming to JS when importing data from the DB
const convertColNamesToUserProps = (id, username, first_name, last_name, password) => {
    const user = {
        id: id,
        username: username,
        firstName: first_name,
        lastName: last_name,
        password: password
    };
    return user;
};
class UserStore {
    // TODO: index
    async index() {
        try {
            const connection = await database_1.default.connect();
            const sql = 'SELECT * FROM users;';
            const result = await connection.query(sql);
            connection.release();
            console.log(typeof result.rows[0]);
            return result.rows.map((dbData) => {
                return convertColNamesToUserProps(dbData.id, dbData.username, dbData.first_name, dbData.last_name, dbData.password);
            });
        }
        catch (err) {
            throw new Error(`Cannot get users: ${err}`);
        }
    }
    // TODO: show
    async show(userId) {
        try {
            const connection = await database_1.default.connect();
            const sql = 'SELECT * FROM users WHERE id = ($1);';
            const result = await connection.query(sql, [userId]);
            const { id, username, first_name, last_name, password } = result.rows[0];
            connection.release();
            return convertColNamesToUserProps(id, username, first_name, last_name, password);
        }
        catch (err) {
            throw new Error(`Cannot get user: ${err}`);
        }
    }
    // TODO: create
    async create(user) {
        try {
            const connection = await database_1.default.connect();
            const sql = 'INSERT INTO users (username, first_name, last_name, password) VALUES ($1, $2, $3, $4) RETURNING *;';
            const hashedPassword = bcrypt_1.default.hashSync(user.password + process.env.PEPPER, parseInt(process.env.SALT_ROUNDS));
            const result = await connection.query(sql, [user.username, user.firstName, user.lastName, hashedPassword]);
            const { id, username, first_name, last_name, password } = result.rows[0];
            connection.release();
            return convertColNamesToUserProps(id, username, first_name, last_name, password);
        }
        catch (err) {
            throw new Error(`Cannot create user ${user.username}: ${err}`);
        }
    }
    // TODO: authenticate
    async authenticate(username, passwordString) {
        try {
            const connection = await database_1.default.connect();
            const sql = 'SELECT * FROM users WHERE username=($1);';
            const result = await connection.query(sql, [username]);
            let auth = null;
            if (result.rows.length) {
                const { id, username, first_name, last_name, password } = result.rows[0];
                const user = convertColNamesToUserProps(id, username, first_name, last_name, password);
                if (bcrypt_1.default.compareSync(passwordString + process.env.PEPPER, user.password)) {
                    auth = user;
                }
            }
            return auth;
        }
        catch (err) {
            throw new Error(`Cannot authenticate user ${username}: ${err}`);
        }
    }
}
exports.UserStore = UserStore;
