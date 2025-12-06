import { NextFunction, Request, Response } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import config from '../config'

export const verifyAuth = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization
      if (!token) {
        return res.status(401).json({ success: false, message: 'Unauthorized' })
      }

      const decoded = jwt.verify(token, config.jwt_secret as string)
      req.user = decoded as JwtPayload
      next()
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message })
    }
  }
}
