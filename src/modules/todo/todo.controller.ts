import { Request, Response } from 'express'
import { pool } from '../../config/db'
import { todoServices } from './todo.service'

const createTodo = async (req: Request, res: Response) => {
  const { user_id, title, description, is_completed, due_date } = req.body
  try {
    const result = await todoServices.createTodoIntoDb(
      user_id,
      title,
      description,
      is_completed,
      due_date
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
}

export const todoController = {
  createTodo
}
