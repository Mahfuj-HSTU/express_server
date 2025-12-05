import { Request, Response } from 'express'
import { pool } from '../../config/db'
import { userServices } from './user.service'

// * create user
const createUser = async (req: Request, res: Response) => {
  const { name, email, age } = req.body
  try {
    const result = await userServices.createUserIntoDb(name, email, age)
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
    const result = await userServices.getAllUsersFromDb()
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

// * get user by id
const getUserById = async (req: Request, res: Response) => {
  const { id } = req?.params
  try {
    const result = await userServices.getUserByIdFromDb(id as unknown as number)
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
}

// * update user
const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params
  const { name, email, age } = req.body
  try {
    const result = await userServices.updateUserIntoDb(
      id as unknown as number,
      name,
      email,
      age
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
}

// * delete user
const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const result = await userServices.deleteUserFromDb(id as unknown as number)
    if ('success' in result) {
      return res.status(404).send(result)
    }
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
}

export const userControllers = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
}
