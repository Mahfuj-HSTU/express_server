import { pool } from '../../config/db'

const createTodoIntoDb = async (
  user_id: number,
  title: string,
  description: string,
  is_completed: boolean,
  due_date: string
) => {
  const result = await pool.query(
    `INSERT INTO todos (user_id, title, description, is_completed, due_date) VALUES ($1, $2, $3, $4, $5)`,
    [user_id, title, description, is_completed, due_date]
  )
  return result
}

const getAllTodosFromDb = async () => {
  const result = await pool.query(`SELECT * FROM todos`)
  return result
}

const getTodoByIdFromDb = async (id: number) => {
  const result = await pool.query(`SELECT * FROM todos WHERE id = $1`, [id])
  return result
}

const updateTodoIntoDb = async (
  id: number,
  user_id: number,
  title: string,
  description: string,
  is_completed: boolean,
  due_date: string
) => {
  const result = await pool.query(
    `UPDATE todos SET user_id = $1, title = $2, description = $3, is_completed = $4, due_date = $5 WHERE id = $6`,
    [user_id, title, description, is_completed, due_date, id]
  )
  return result
}

const deleteTodoFromDb = async (id: number) => {
  const result = await pool.query(`DELETE FROM todos WHERE id = $1`, [id])
  return result
}

export const todoServices = {
  createTodoIntoDb,
  getAllTodosFromDb,
  getTodoByIdFromDb,
  updateTodoIntoDb,
  deleteTodoFromDb
}
