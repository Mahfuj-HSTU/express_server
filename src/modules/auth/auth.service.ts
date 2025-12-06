import { pool } from '../../config/db'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import config from '../../config'

const loginUser = async (email: string, password: string) => {
  const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [
    email
  ])
  if (result.rows.length === 0) {
    return {
      success: false,
      message: 'User not found',
      error: 'User not found'
    }
  }
  const user = result.rows[0]
  const isPasswordMatched = await bcrypt.compare(password, user.password)
  if (!isPasswordMatched) {
    return {
      success: false,
      message: 'Invalid password',
      error: 'Invalid password'
    }
  }

  const token = jwt.sign(
    { name: user.name, email: user.email },
    config.jwt_secret as string,
    {
      expiresIn: '7d'
    }
  )
  return { user, token }
}

export const authServices = {
  loginUser
}
