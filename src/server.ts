import express, { Request, Response } from 'express'
import dotenv from 'dotenv'

const app: express.Application = express()
const PORT: String | Number = process.env.PORT || 3000

app.use(express.json())

app.get('/', function (req: Request, res: Response) {
    res.send('Hello World!')
})

app.listen(PORT, function () {
    console.log(`starting app on port ${PORT}`)
})
