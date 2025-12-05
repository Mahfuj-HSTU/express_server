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

const getAllTodos = async (req: Request, res: Response) => {
  try {
    const result = await todoServices.getAllTodosFromDb()
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
}

const getTodoById = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const result = await todoServices.getTodoByIdFromDb(id as unknown as number)
    if (result.rows.length === 0) {
      return res.status(404).send({
        success: false,
        message: 'Todo not found',
        error: 'Todo not found'
      })
    } else {
      res.send({
        success: true,
        message: 'Todo fetched successfully',
        data: result.rows[0]
      })
    }
  } catch (error: any) {
    res.status(500).send({
      success: false,
      message: 'Failed to fetch todo',
      error: error.message
    })
  }
}

const updateTodo = async (req: Request, res: Response) => {
  const { id } = req.params
  const { user_id, title, description, is_completed, due_date } = req.body
  try {
    const result = await todoServices.updateTodoIntoDb(
      id as unknown as number,
      user_id,
      title,
      description,
      is_completed,
      due_date
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
}

const deleteTodo = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const result = await todoServices.deleteTodoFromDb(id as unknown as number)
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
}

export const todoController = {
  createTodo,
  getAllTodos,
  getTodoById,
  updateTodo,
  deleteTodo
}
