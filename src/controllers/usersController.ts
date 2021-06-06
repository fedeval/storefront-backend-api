import { Application, Request, Response } from 'express';
import { User, UserStore } from '../models/user';

const store = new UserStore();

const index = async (req: Request, res: Response) => {
  try {
    const users = await store.index();
    res.json(users);
  } catch (err) {
    console.error(err.message);
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const user = await store.show(id);
    res.json(user);
  } catch (err) {
    console.error(err.message);
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const userInfo: User = {
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: req.body.password
    };
    const user = await store.create(userInfo);
    res.json(user);
  } catch (err) {
    console.error(err.message);
  }
};

const authenticate = async (req: Request, res: Response) => {
  try {
    const user = await store.authenticate(req.body.username, req.body.password);
    if (user) {
      res.json(user);
    } else {
      res.send('Invalid username and/or password');
    }
  } catch (err) {
    console.error(err.message);
  }
};

export const userRouter = (app: Application): void => {
  app.get('/users', index);
  app.get('/users/:id', show);
  app.post('/users', create);
  app.get('/auth', authenticate);
};
