import express, { Request, Response } from 'express';
import { productRouter } from './controllers/productsController';
import { userRouter } from './controllers/usersController';
import { orderRouter } from './controllers/ordersController';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app: express.Application = express();
const PORT: string | number = process.env.PORT || 3000;

app.use(express.json());
app.use(
  cors({
    origin: `http://localhost:${PORT}`
  })
);

app.get('/', function (req: Request, res: Response) {
  res.send('Hello World!');
});

// Initialise all the routers
productRouter(app);
userRouter(app);
orderRouter(app);

app.listen(PORT, function () {
  console.log(`starting app on port ${PORT}`);
});

export default app;
