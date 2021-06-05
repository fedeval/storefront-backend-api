"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userListWithIdAndNoPwd = exports.userList = void 0;
const lodash_1 = __importDefault(require("lodash"));
// Mock user data
exports.userList = [
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
exports.userListWithIdAndNoPwd = exports.userList.map((user, index) => {
    return {
        id: index + 1,
        ...lodash_1.default.pick(user, ['username', 'firstName', 'lastName'])
    };
});
