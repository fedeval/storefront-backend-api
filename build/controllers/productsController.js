"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRouter = void 0;
const product_1 = require("../models/product");
const store = new product_1.ProductStore();
const index = async (req, res) => {
    try {
        const products = await store.index();
        res.json(products);
    }
    catch (err) {
        console.error(err.message);
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
    }
};
const productRouter = (app) => {
    app.get('/products', index);
    app.get('/products/:id', show);
    app.post('/products', create);
    app.delete('/products/:id', destroy);
};
exports.productRouter = productRouter;
