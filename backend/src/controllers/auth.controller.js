import { registerUser,loginUser } from '../services/auth.service.js'

const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 24 * 60 * 60 * 1000,
}
export async function register(req, res) {
  const user = await registerUser(req.body)
  res.status(201).json({ user })
}
export async function login(req, res) {
  const { user, token } = await loginUser(req.body)
  res.cookie('token', token, cookieOptions)
  res.json({ user })
}

export function logout(req, res) {
  res.clearCookie('token', cookieOptions)
  res.json({ message: 'Logged out' })
}
