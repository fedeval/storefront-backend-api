"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("../../server"));
const supertest_1 = __importDefault(require("supertest"));
const request = supertest_1.default(server_1.default);
describe('Products controller', () => {
    it('gets /products endpoint', async (done) => {
        const response = await request.get('/products');
        expect(response.status).toBe(200);
        done();
    });
});
