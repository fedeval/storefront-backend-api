"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserStore = void 0;
const database_1 = __importDefault(require("../database"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
const namingConventions_1 = require("../utils/namingConventions");
dotenv_1.default.config();
const { PEPPER, SALT_ROUNDS } = process.env;
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
                return namingConventions_1.convertColNamesToUserProps(dbData.id, dbData.username, dbData.first_name, dbData.last_name, dbData.password);
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
            return namingConventions_1.convertColNamesToUserProps(id, username, first_name, last_name, password);
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
            const hashedPassword = bcrypt_1.default.hashSync(user.password + PEPPER, parseInt(SALT_ROUNDS));
            const result = await connection.query(sql, [
                user.username,
                user.firstName,
                user.lastName,
                hashedPassword
            ]);
            const { id, username, first_name, last_name, password } = result.rows[0];
            connection.release();
            return namingConventions_1.convertColNamesToUserProps(id, username, first_name, last_name, password);
        }
        catch (err) {
            throw new Error(`Cannot create user ${user.username}: ${err}`);
        }
    }
    // TODO: authenticate
    async authenticate(username, pwdString) {
        try {
            const connection = await database_1.default.connect();
            const sql = 'SELECT * FROM users WHERE username=($1);';
            const result = await connection.query(sql, [username]);
            let auth = null;
            if (result.rows.length) {
                const { id, username, first_name, last_name, password } = result.rows[0];
                const user = namingConventions_1.convertColNamesToUserProps(id, username, first_name, last_name, password);
                if (bcrypt_1.default.compareSync(pwdString + PEPPER, user.password)) {
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
