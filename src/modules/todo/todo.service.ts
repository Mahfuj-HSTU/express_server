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

export const todoServices = {
  createTodoIntoDb
}
