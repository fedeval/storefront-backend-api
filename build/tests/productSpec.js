"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const product_1 = require("../models/product");
const store = new product_1.ProductStore();
const productList = [
    {
        name: 'bike',
        price: 150,
        category: 'sports',
        rating: 4.35
    },
    {
        name: 'kayak',
        price: 600,
        category: 'sports',
        rating: 4.6
    },
    {
        name: 'carpet',
        price: 40,
        category: 'household',
        rating: 3.43
    },
    {
        name: 'desk',
        price: 200,
        category: 'office',
        rating: 3.9
    },
    {
        name: 'pen',
        price: 2,
        category: 'office',
        rating: 2.91
    },
    {
        name: 'laptop',
        price: 2000,
        category: 'office',
        rating: 4.9
    },
    {
        name: 'chair',
        price: 40,
        category: 'household',
        rating: 4.2
    }
];
const prodListWithId = productList.map((product, index) => {
    product.id = index + 1;
    return product;
});
describe('Testing Product model', () => {
    it('has an index method', () => {
        expect(store.index).toBeDefined();
    });
    it('has a show method', () => {
        expect(store.show).toBeDefined();
    });
    it('has a create method', () => {
        expect(store.create).toBeDefined();
    });
    it('has a delete method', () => {
        expect(store.delete).toBeDefined();
    });
    beforeAll(async () => {
        for (const product of productList) {
            await store.create(product);
        }
    });
    it('index should return a list of all products', async () => {
        const result = await store.index();
        expect(result).toEqual(prodListWithId);
    });
    it('create should add a product', async () => {
        const result = await store.create({
            name: 'notepad',
            price: 9,
            category: 'office',
            rating: 4.2
        });
        expect(result).toEqual({
            id: 8,
            name: 'notepad',
            price: 9,
            category: 'office',
            rating: 4.2
        });
    });
    it('show should return the product with the given id', async () => {
        const result = await store.show(8);
        expect(result).toEqual({
            id: 8,
            name: 'notepad',
            price: 9,
            category: 'office',
            rating: 4.2
        });
    });
    it('delete should remove the product with the given id', async () => {
        await store.delete(8);
        const result = await store.index();
        expect(result).not.toContain({
            id: 8,
            name: 'notepad',
            price: 9,
            category: 'office',
            rating: 4.2
        });
    });
});
