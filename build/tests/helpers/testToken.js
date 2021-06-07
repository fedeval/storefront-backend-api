"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testToken = void 0;
const jwtAuthentication_1 = require("../../utils/jwtAuthentication");
exports.testToken = jwtAuthentication_1.createAuthToken('test');
