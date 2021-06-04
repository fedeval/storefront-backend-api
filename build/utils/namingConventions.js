"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertColNamesToUserProps = void 0;
/*
SQL and JS have different naming conventions:
- lower_snake_case: SQL columns
- camelCase: JS object properties
To avoid breaking conventions we can use this function to convert
from SQL naming to JS when importing data from the DB
*/
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
exports.convertColNamesToUserProps = convertColNamesToUserProps;
