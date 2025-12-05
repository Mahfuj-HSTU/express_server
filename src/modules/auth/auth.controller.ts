import { Request, Response } from 'express'
import { authServices } from './auth.service'

// const register = async (req: Request, res: Response) => {
//   try {
//     const result = await userServices.createUserIntoDb(req.body)
//     res.send({
//       success: true,
//       message: 'User created successfully',
//       data: result.rows[0]
//     })
//   } catch (error: any) {
//     res.status(500).send({
//       success: false,
//       message: 'Failed to create user',
//       error: error.message
//     })
//   }
// }

const login = async (req: Request, res: Response) => {
  try {
    console.log(req.body)
    const result = await authServices.loginUser(
      req.body.email,
      req.body.password
    )
    if ('success' in result) {
      return res.status(404).send(result)
    }
    res.status(200).send({
      success: true,
      message: 'User logged in successfully',
      token: result.token
    })
  } catch (error: any) {
    res.status(500).send({
      success: false,
      message: 'Failed to log in user',
      error: error.message
    })
  }
}

export const authControllers = {
  login
}
