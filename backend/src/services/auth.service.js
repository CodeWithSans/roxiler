import bcrypt from 'bcrypt'
import sql from '../db/db.js'
import AppError from '../utils/AppError.js'
import { ROLES } from '../utils/constants.js'
import jwt from 'jsonwebtoken'


export async function registerUser({ name, email, address, password }) {
  const [existing] = await sql`select id from users where email = ${email}`
  if (existing) {
    throw new AppError(409, 'Email is already registered')
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const [user] = await sql`
    insert into users (name, email, address, password_hash, role)
    values (${name}, ${email}, ${address}, ${passwordHash}, ${ROLES.USER})
    returning id, name, email, address, role`

    
  return user
}
export async function loginUser({ email, password }) {
  const [user] = await sql`
    select id, name, email, address, role, password_hash
    from users where email = ${email}`

  const passwordOk = user && (await bcrypt.compare(password, user.password_hash))
  if (!passwordOk) {
    throw new AppError(401, 'Invalid email or password')
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  )

  delete user.password_hash
  return { user, token }
}
