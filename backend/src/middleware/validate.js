import AppError from '../utils/AppError.js'

export default function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body)

    if (!result.success) {
      throw new AppError(400, result.error.issues[0].message)
    }

    req.body = result.data
    next()
  }
}
