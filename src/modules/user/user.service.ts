import { pool } from '../../config/db'
import bcrypt from 'bcryptjs'

const createUserIntoDb = async (payload: Record<string, unknown>) => {
  const { name, role, email, age, password } = payload

  const hashedPassword = await bcrypt.hash(password as string, 10)

  const result = await pool.query(
    `INSERT INTO users(name, role, email, age, password) VALUES($1, $2, $3, $4, $5) RETURNING *`,
    [name, role, email, age, hashedPassword]
  )
  return result
}

const getAllUsersFromDb = async () => {
  const result = await pool.query(`SELECT * FROM users`)
  return result
}

const getUserByIdFromDb = async (id: number) => {
  const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id])
  return result
}

const updateUserIntoDb = async (
  id: number,
  name: string,
  email: string,
  age: number
) => {
  const updateUser = await pool.query(
    `UPDATE users SET name = $1, email = $2, age = $3 WHERE id = $4`,
    [name, email, age, id]
  )
  return updateUser
}

const deleteUserFromDb = async (id: number) => {
  const deleteUser = await pool.query(`DELETE FROM users WHERE id = $1`, [id])
  if (deleteUser.rowCount === 0) {
    return {
      success: false,
      message: 'User not found',
      error: 'User not found'
    }
  }
  if (deleteUser.rowCount === 1) {
    const todo = await pool.query(`DELETE FROM todos WHERE user_id = $1`, [id])
    return todo
  }
  return deleteUser
}

export const userServices = {
  createUserIntoDb,
  getAllUsersFromDb,
  getUserByIdFromDb,
  updateUserIntoDb,
  deleteUserFromDb
}
