import express, { Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app: express.Application = express();
const PORT: string | number = process.env.PORT || 3000;

app.use(express.json());

app.get('/', function (req: Request, res: Response) {
  res.send('Hello World!');
});

app.listen(PORT, function () {
  console.log(`starting app on port ${PORT}`);
});
