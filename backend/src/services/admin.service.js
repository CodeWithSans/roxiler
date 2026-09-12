import sql from '../db/db.js'
import AppError from '../utils/AppError.js'
import { ROLES } from '../utils/constants.js'

export async function getDashboardStats() {
  const [stats] = await sql`
    select
      (select count(*) from users)::int   as total_users,
      (select count(*) from stores)::int  as total_stores,
      (select count(*) from ratings)::int as total_ratings`

  return stats
}
export async function listUsers({ name, email, address, role, sortBy, order }) {
  const direction = order === 'desc' ? sql`desc` : sql`asc`

  return sql`
    select id, name, email, address, role
    from users
    where name ilike ${'%' + name + '%'}
      and email ilike ${'%' + email + '%'}
      and address ilike ${'%' + address + '%'}
      ${role ? sql`and role = ${role}` : sql``}
    order by ${sql(sortBy)} ${direction}`
}

export async function getUserDetails(id) {
  const [user] = await sql`
    select u.id, u.name, u.email, u.address, u.role,
      (select round(avg(r.rating), 1)::float
         from ratings r join stores s on s.id = r.store_id
        where s.owner_id = u.id) as rating
    from users u
    where u.id = ${id}`

  if (!user) {
    throw new AppError(404, 'User not found')
  }
  if (user.role !== ROLES.OWNER) {
    delete user.rating
  }
  return user
}

const STORE_SORT = {
  name: 's.name',
  email: 's.email',
  address: 's.address',
  rating: 'rating',
}

export async function listAllStores({ name, email, address, sortBy, order }) {
  const direction = order === 'desc' ? sql`desc` : sql`asc`

  return sql`
    select s.id, s.name, s.email, s.address,
      round(avg(r.rating), 1)::float as rating
    from stores s
    left join ratings r on r.store_id = s.id
    where s.name ilike ${'%' + name + '%'}
      and s.email ilike ${'%' + email + '%'}
      and s.address ilike ${'%' + address + '%'}
    group by s.id
    order by ${sql(STORE_SORT[sortBy])} ${direction} nulls last`
}

export async function createStore({ name, email, address, ownerId }) {
  const [existing] = await sql`select id from stores where email = ${email}`
  if (existing) {
    throw new AppError(409, 'Store email is already registered')
  }

  if (ownerId) {
    const [owner] = await sql`select role from users where id = ${ownerId}`
    if (!owner || owner.role !== ROLES.OWNER) {
      throw new AppError(400, 'Owner must be an existing user with the OWNER role')
    }
  }

  const [store] = await sql`
    insert into stores (name, email, address, owner_id)
    values (${name}, ${email}, ${address}, ${ownerId ?? null})
    returning id, name, email, address, owner_id`

  return store
}
