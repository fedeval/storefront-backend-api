"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("../models/user");
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const store = new user_1.UserStore();
const userList = [
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
const basePwdStrings = ['testpwd1', 'testpwd2', 'testpwd3'];
const hashedPwdStrings = basePwdStrings.map((pwd) => bcrypt_1.default.hashSync(pwd + process.env.PEPPER, parseInt(process.env.SALT_ROUNDS)));
const userListWithIdAndHashPwd = userList.map((user, index) => {
    user.id = index + 1;
    user.password = hashedPwdStrings[index];
    return user;
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
        expect(result).toEqual(userListWithIdAndHashPwd);
    });
    it('create should add a user', async () => {
        const result = await store.create({
            username: 'testuser4',
            firstName: 'Roger',
            lastName: 'Taylor',
            password: 'testpwd4'
        });
        expect(result).toBe({
            id: 4,
            username: 'testuser4',
            firstName: 'Roger',
            lastName: 'Taylor',
            password: bcrypt_1.default.hashSync('testpwd4' + process.env.PEPPER, parseInt(process.env.SALT_ROUNDS))
        });
    });
    it('show should return the user with the given id', async () => {
        const result = await store.show(4);
        expect(result).toBe({
            id: 4,
            username: 'testuser4',
            firstName: 'Roger',
            lastName: 'Taylor',
            password: bcrypt_1.default.hashSync('testpwd4' + process.env.PEPPER, parseInt(process.env.SALT_ROUNDS))
        });
    });
    it('authenticate should return null for the wrong user and password combination', async () => {
        const result = await store.authenticate('testuser1', 'testpwd2');
        expect(result).toBe(null);
    });
    it('authenticate should return a user for the right user and password combination', async () => {
        const result = await store.authenticate('testuser1', 'testpwd1');
        expect(result).toBe(userListWithIdAndHashPwd[0]);
    });
});
