import 'dotenv/config'
import express, { Request, Response } from 'express'
import { Pool } from 'pg'
const app = express()
const port = 5000

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('localhost')
    ? false
    : {
        rejectUnauthorized: false
      },
  // increase timeouts to avoid transient ETIMEDOUT
  connectionTimeoutMillis: 20000,
  idleTimeoutMillis: 30000,
  max: 5
})

const initDb = async () => {
  try {
    await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL,
      age INT NOT NULL,
      phone VARCHAR(15),
      address TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )`)
    await pool.query(`CREATE TABLE IF NOT EXISTS todos (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    is_completed BOOLEAN DEFAULT false,
    due_date DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  )`)
    console.log('Database connected')
  } catch (error) {
    console.error('Error initializing database:', error)
  }
}

initDb()

// * parsing json body middleware
app.use(express.json())
// app.use(express.urlencoded({ extended: true })) //? for form data

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World! with typescript')
})

app.post('/', (req: Request, res: Response) => {
  console.log(req.body)
  res.send({
    success: true,
    message: 'Data received successfully',
    data: req.body
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
