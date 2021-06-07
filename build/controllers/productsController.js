"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRouter = void 0;
const product_1 = require("../models/product");
const jwtAuthentication_1 = require("../utils/jwtAuthentication");
const store = new product_1.ProductStore();
const index = async (req, res) => {
    try {
        const products = await store.index();
        res.json(products);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send(`${err.message}`);
    }
};
const show = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const product = await store.show(id);
        res.json(product);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send(`${err.message}`);
    }
};
const create = async (req, res) => {
    try {
        const productInfo = {
            name: req.body.name,
            price: req.body.price,
            category: req.body.category,
            rating: req.body.rating
        };
        const product = await store.create(productInfo);
        res.json(product);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send(`${err.message}`);
    }
};
const destroy = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const product = await store.delete(id);
        res.json(product);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send(`${err.message}`);
    }
};
const productRouter = (app) => {
    app.get('/products', index);
    app.get('/products/:id', show);
    app.post('/products', jwtAuthentication_1.verifyAuthToken, create);
    app.delete('/products/:id', jwtAuthentication_1.verifyAuthToken, destroy);
};
exports.productRouter = productRouter;
