"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productsController_1 = require("./controllers/productsController");
const usersController_1 = require("./controllers/usersController");
const ordersController_1 = require("./controllers/ordersController");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = express_1.default();
const PORT = process.env.PORT || 3000;
app.use(express_1.default.json());
app.get('/', function (req, res) {
    res.send('Hello World!');
});
// Initialise all the routers
productsController_1.productRouter(app);
usersController_1.userRouter(app);
ordersController_1.orderRouter(app);
app.listen(PORT, function () {
    console.log(`starting app on port ${PORT}`);
});
