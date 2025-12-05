import { pool } from '../../config/db'

const createUserIntoDb = async (name: string, email: string, age: number) => {
  const result = await pool.query(
    `INSERT INTO users (name, email, age) VALUES ($1, $2, $3)`,
    [name, email, age]
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
