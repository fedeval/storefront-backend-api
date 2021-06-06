"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderRouter = void 0;
const order_1 = require("../models/order");
const store = new order_1.OrderStore();
const create = async (req, res) => {
    try {
        const userId = req.body.userId;
        const order = await store.create(userId);
        res.json(order);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send(`${err.message}`);
    }
};
const update = async (req, res) => {
    try {
        const userId = req.body.userId;
        const order = await store.updateStatus(userId);
        res.json(order);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send(`${err.message}`);
    }
};
const active = async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const order = await store.getActiveOrder(userId);
        res.json(order);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send(`${err.message}`);
    }
};
const completed = async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const order = await store.getCompletedOrders(userId);
        res.json(order);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send(`${err.message}`);
    }
};
const orderRouter = (app) => {
    app.post('/orders', create);
    app.put('/orders', update);
    app.get('/orders/users/:userId/active', active);
    app.get('/orders/users/:userId/completed', completed);
};
exports.orderRouter = orderRouter;
