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
class UserStore {
    // TODO: index
    async index() {
        try {
            const connection = await database_1.default.connect();
            const sql = 'SELECT * FROM users;';
            const result = await connection.query(sql);
            connection.release();
            console.log(typeof result.rows[0]);
            return result.rows;
        }
        catch (err) {
            throw new Error(`Cannot get users: ${err}`);
        }
    }
    // TODO: show
    async show(id) {
        try {
            const connection = await database_1.default.connect();
            const sql = 'SELECT * FROM users WHERE id = ($1)';
            const result = await connection.query(sql, [id]);
            const user = result.rows[0];
            connection.release();
            return user;
        }
        catch (err) {
            throw new Error(`Cannot get user: ${err}`);
        }
    }
    // TODO: create
    async create(user) {
        try {
            const connection = await database_1.default.connect();
            const sql = 'INSERT INTO users (username, first_name, last_name, password) VALUES ($1, $2, $3, $4)';
            const hashedPassword = bcrypt_1.default.hashSync(user.password + process.env.PEPPER, parseInt(process.env.SALT_ROUNDS));
            const result = await connection.query(sql, [user.username, user.firstName, user.lastName, hashedPassword]);
            const newUser = result.rows[0];
            connection.release();
            return newUser;
        }
        catch (err) {
            throw new Error(`Cannot create user ${user.username}: ${err}`);
        }
    }
    // TODO: authenticate
    async authenticate(username, password) {
        try {
            const connection = await database_1.default.connect();
            const sql = 'SELECT * FROM users WHERE username=($1)';
            const result = await connection.query(sql, [username]);
            let auth = null;
            if (result.rows.length) {
                const user = result.rows[0];
                if (bcrypt_1.default.compareSync(password + process.env.PEPPER, user.password)) {
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
