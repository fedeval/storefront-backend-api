"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const product_1 = require("../models/product");
const store = new product_1.ProductStore();
describe('Testing Product model', () => {
    it('Has an index method', () => {
        expect(store.index).toBeDefined();
    });
    it('Has a show method', () => {
        expect(store.show).toBeDefined();
    });
    it('Has a create method', () => {
        expect(store.create).toBeDefined();
    });
    it('Has a topfive method', () => {
        expect(store.topfive).toBeDefined();
    });
});
