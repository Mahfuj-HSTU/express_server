import { Request, Response } from 'express'
import { pool } from '../../config/db'

// * create user
const createUser = async (req: Request, res: Response) => {
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
}

// * get all users
const getAllUsers = async (req: Request, res: Response) => {
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
}

export const userControllers = {
  createUser,
  getAllUsers
}
