import { Application, Request, Response } from 'express';
import { OrderStore } from '../models/order'

const store = new OrderStore()

const create = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId
    const order = await store.create(userId)
    res.json(order)
  } catch (err) {
    console.error(err.message)
    res.status(500).send(`${err.message}`)
  }
}

const update = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId
    const order = await store.updateStatus(userId)
    res.json(order)
  } catch (err) {
    console.error(err.message)
    res.status(500).send(`${err.message}`)
  }
}

const active = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId)
    const order = await store.getActiveOrder(userId)
    res.json(order)
  } catch (err) {
    console.error(err.message)
    res.status(500).send(`${err.message}`)
  }
}

const completed = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId)
    const order = await store.getCompletedOrders(userId)
    res.json(order)
  } catch (err) {
    console.error(err.message)
    res.status(500).send(`${err.message}`)
  }
}

export const orderRouter = (app: Application): void => {
  app.post('/orders', create)
  app.put('/orders', update)
  app.get('/orders/users/:userId/active', active)
  app.get('/orders/users/:userId/completed', completed)
}