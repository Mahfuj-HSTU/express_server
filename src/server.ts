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
      email VARCHAR(100) UNIQUE NOT NULL,
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

// *post users
app.post('/users', async (req: Request, res: Response) => {
  const { name, email, age } = req.body
  try {
    const result = await pool.query(
      `INSERT INTO users (name, email, age) VALUES ($1, $2, $3)`,
      [name, email, age]
    )
    res.send({
      success: true,
      message: 'User created successfully',
      data: result.rows[0]
    })
  } catch (error: any) {
    res.status(500).send({
      success: false,
      message: 'Failed to create user',
      error: error.message
    })
  }
  res.send({
    success: true,
    message: 'Data received successfully',
    data: req.body
  })
})

// *get users
app.get('/users', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM users`)
    res.send({
      success: true,
      message: 'Users fetched successfully',
      data: result.rows
    })
  } catch (error: any) {
    res.status(500).send({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    })
  }
})

// *get user by id
app.get('/users/:id', async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id])
    if (result.rows.length === 0) {
      return res.status(404).send({
        success: false,
        message: 'User not found',
        error: 'User not found'
      })
    } else {
      res.send({
        success: true,
        message: 'User fetched successfully',
        data: result.rows[0]
      })
    }
  } catch (error: any) {
    res.status(500).send({
      success: false,
      message: 'Failed to fetch user',
      error: error.message
    })
  }
})

// *update user
app.put('/users/:id', async (req: Request, res: Response) => {
  const { id } = req.params
  const { name, email, age } = req.body
  try {
    const result = await pool.query(
      `UPDATE users SET name = $1, email = $2, age = $3 WHERE id = $4`,
      [name, email, age, id]
    )
    res.send({
      success: true,
      message: 'User updated successfully',
      data: result.rows[0]
    })
  } catch (error: any) {
    res.status(500).send({
      success: false,
      message: 'Failed to update user',
      error: error.message
    })
  }
})

// *delete user
app.delete('/users/:id', async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const result = await pool.query(`DELETE FROM users WHERE id = $1`, [id])
    res.send({
      success: true,
      message: 'User deleted successfully',
      data: result.rows[0]
    })
  } catch (error: any) {
    res.status(500).send({
      success: false,
      message: 'Failed to delete user',
      error: error.message
    })
  }
})

// *post todos
app.post('/todos', async (req: Request, res: Response) => {
  const { user_id, title, description, is_completed, due_date } = req.body
  try {
    const result = await pool.query(
      `INSERT INTO todos (user_id, title, description, is_completed, due_date) VALUES ($1, $2, $3, $4, $5)`,
      [user_id, title, description, is_completed, due_date]
    )
    res.send({
      success: true,
      message: 'Todo created successfully',
      data: result.rows[0]
    })
  } catch (error: any) {
    res.status(500).send({
      success: false,
      message: 'Failed to create todo',
      error: error.message
    })
  }
})

// *get todos
app.get('/todos', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM todos`)
    res.send({
      success: true,
      message: 'Todos fetched successfully',
      data: result.rows
    })
  } catch (error: any) {
    res.status(500).send({
      success: false,
      message: 'Failed to fetch todos',
      error: error.message
    })
  }
})

// *get todos by user id
app.get('/todos/:user_id', async (req: Request, res: Response) => {
  const { user_id } = req.params
  try {
    const result = await pool.query(`SELECT * FROM todos WHERE user_id = $1`, [
      user_id
    ])
    res.send({
      success: true,
      message: 'Todos fetched successfully',
      data: result.rows
    })
  } catch (error: any) {
    res.status(500).send({
      success: false,
      message: 'Failed to fetch todos',
      error: error.message
    })
  }
})

// *get todos by id
app.get('/todos/:id', async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const result = await pool.query(`SELECT * FROM todos WHERE id = $1`, [id])
    res.send({
      success: true,
      message: 'Todo fetched successfully',
      data: result.rows[0]
    })
  } catch (error: any) {
    res.status(500).send({
      success: false,
      message: 'Failed to fetch todo',
      error: error.message
    })
  }
})

// *update todo
app.put('/todos/:id', async (req: Request, res: Response) => {
  const { id } = req.params
  const { user_id, title, description, is_completed, due_date } = req.body
  try {
    const result = await pool.query(
      `UPDATE todos SET user_id = $1, title = $2, description = $3, is_completed = $4, due_date = $5 WHERE id = $6`,
      [user_id, title, description, is_completed, due_date, id]
    )
    res.send({
      success: true,
      message: 'Todo updated successfully',
      data: result.rows[0]
    })
  } catch (error: any) {
    res.status(500).send({
      success: false,
      message: 'Failed to update todo',
      error: error.message
    })
  }
})

// *delete todo
app.delete('/todos/:id', async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const result = await pool.query(`DELETE FROM todos WHERE id = $1`, [id])
    res.send({
      success: true,
      message: 'Todo deleted successfully',
      data: result.rows[0]
    })
  } catch (error: any) {
    res.status(500).send({
      success: false,
      message: 'Failed to delete todo',
      error: error.message
    })
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
