"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.columnNamesToOrderProps = exports.columnNamesToOrderDetails = exports.columnNamesToUserProps = void 0;
/*
SQL and JS have different naming conventions:
- lower_snake_case: SQL columns
- camelCase: JS object properties
To avoid breaking conventions we can use these functions to convert
from SQL naming to JS when importing data from the DB
*/
const columnNamesToUserProps = (id, username, first_name, last_name, password) => {
    const user = {
        id: id,
        username: username,
        firstName: first_name,
        lastName: last_name,
        password: password
    };
    return user;
};
exports.columnNamesToUserProps = columnNamesToUserProps;
const columnNamesToOrderDetails = (id, product_id, quantity, order_id) => {
    return {
        id: id,
        productId: product_id,
        quantity: quantity,
        orderId: order_id
    };
};
exports.columnNamesToOrderDetails = columnNamesToOrderDetails;
const columnNamesToOrderProps = (id, user_id, current_status) => {
    const order = {
        id: id,
        userId: user_id,
        currentStatus: current_status
    };
    return order;
};
exports.columnNamesToOrderProps = columnNamesToOrderProps;
