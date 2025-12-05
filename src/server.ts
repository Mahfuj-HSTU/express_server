import config from './config'
import express, { Request, Response } from 'express'
import { initDb, pool } from './config/db'
import logger from './middleware/logger'
import { userRoutes } from './modules/user/user.routes'
import { todoRoutes } from './modules/todo/todo.routes'
import { authRoutes } from './modules/auth/auth.route'
const app = express()
const port = config.port

//* initial db
initDb()

// * parsing json body middleware
app.use(express.json())
// app.use(express.urlencoded({ extended: true })) //? for form data

app.get('/', logger, (req: Request, res: Response) => {
  res.send('Hello World! with typescript')
})

app.use('/users', userRoutes)
app.use('/todos', todoRoutes)
app.use('/auth', authRoutes)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
