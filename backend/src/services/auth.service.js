import bcrypt from 'bcrypt'
import sql from '../db/db.js'
import AppError from '../utils/AppError.js'
import { ROLES } from '../utils/constants.js'

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
