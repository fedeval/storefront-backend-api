import { Application, Request, Response } from 'express';
import { Product, ProductStore } from '../models/product';
import { verifyAuthToken } from '../utils/jwtAuthentication';

const store = new ProductStore();

const index = async (req: Request, res: Response) => {
  try {
    const products = await store.index();
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send(`${err.message}`);
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const product = await store.show(id);
    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send(`${err.message}`);
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const productInfo: Product = {
      name: req.body.name,
      price: req.body.price,
      category: req.body.category,
      rating: req.body.rating
    };
    const product = await store.create(productInfo);
    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send(`${err.message}`);
  }
};

const destroy = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const product = await store.delete(id);
    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send(`${err.message}`);
  }
};

export const productRouter = (app: Application): void => {
  app.get('/products', index);
  app.get('/products/:id', show);
  app.post('/products', verifyAuthToken, create);
  app.delete('/products/:id', verifyAuthToken, destroy);
};
