import express from 'express'
import { userControllers } from './user.controller'
import { verifyAuth } from '../../middleware/auth'

const router = express.Router()

router.post('/', userControllers.createUser)
router.get('/', verifyAuth(), userControllers.getAllUsers)
router.get('/:id', userControllers.getUserById)
router.put('/:id', userControllers.updateUser)
router.delete('/:id', userControllers.deleteUser)

export const userRoutes = router
