"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAuthToken = exports.createAuthToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { TOKEN_SECRET } = process.env;
const createAuthToken = (username) => {
    return jsonwebtoken_1.default.sign({ username: username }, TOKEN_SECRET);
};
exports.createAuthToken = createAuthToken;
const verifyAuthToken = (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization;
        const token = authorizationHeader ? authorizationHeader.split(' ')[1] : '';
        jsonwebtoken_1.default.verify(token, TOKEN_SECRET);
        next();
    }
    catch (error) {
        res.status(401);
    }
};
exports.verifyAuthToken = verifyAuthToken;
