import express from 'express'
import { userControllers } from './user.controller'
import { verifyAuth } from '../../middleware/auth'

const router = express.Router()

router.post('/', userControllers.createUser)
router.get('/', verifyAuth('admin'), userControllers.getAllUsers)
router.get('/:id', verifyAuth('admin', 'user'), userControllers.getUserById)
router.put('/:id', verifyAuth('admin', 'user'), userControllers.updateUser)
router.delete('/:id', verifyAuth('admin'), userControllers.deleteUser)

export const userRoutes = router
