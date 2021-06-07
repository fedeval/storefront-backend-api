"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const user_1 = require("../models/user");
const jwtAuthentication_1 = require("../utils/jwtAuthentication");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { TOKEN_SECRET } = process.env;
const store = new user_1.UserStore();
const index = async (req, res) => {
    try {
        const users = await store.index();
        res.json(users);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send(`${err.message}`);
    }
};
const show = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const user = await store.show(id);
        res.json(user);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send(`${err.message}`);
    }
};
const create = async (req, res) => {
    const userInfo = {
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password
    };
    try {
        const user = await store.create(userInfo);
        const token = jwtAuthentication_1.createAuthToken(user.username);
        res.json(token);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send(`${err.message}`);
    }
};
const authenticate = async (req, res) => {
    try {
        const user = await store.authenticate(req.body.username, req.body.password);
        if (user) {
            const token = jwtAuthentication_1.createAuthToken(user.username);
            res.json(token);
        }
        else {
            res.send('Invalid username and/or password');
        }
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send(`${err.message}`);
    }
};
const addProduct = async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const { productId, quantity } = req.body;
        const orderDetails = await store.addProductToOrder(userId, productId, quantity);
        res.json(orderDetails);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send(`${err.message}`);
    }
};
const removeProduct = async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const productId = req.body.productId;
        const orderDetails = await store.removeProductFromOrder(userId, productId);
        res.json(orderDetails);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send(`${err.message}`);
    }
};
const userRouter = (app) => {
    app.get('/users', index);
    app.get('/users/:id', show);
    app.post('/users', create);
    app.get('/auth', authenticate);
    app.post('/users/:id/add-product-to-order', addProduct);
    app.delete('/users/:id/remove-product-from-order', removeProduct);
};
exports.userRouter = userRouter;
