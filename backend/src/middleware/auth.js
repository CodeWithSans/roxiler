import jwt from 'jsonwebtoken'
import AppError from '../utils/AppError.js'

export function requireAuth(req, res, next) {
  const token = req.cookies.token
  if (!token) {
    throw new AppError(401, 'Please log in')
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET)
  } catch {
    throw new AppError(401, 'Session expired, please log in again')
  }

  next()
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new AppError(403, 'You do not have permission')
    }
    next()
  }
}
