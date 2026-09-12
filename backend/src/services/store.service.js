import sql from '../db/db.js'
import AppError from '../utils/AppError.js'

const SORT_COLUMNS = {
  name: 's.name',
  address: 's.address',
  rating: 'overall_rating',
}

export async function listStores(userId, { search, sortBy, order }) {
  const pattern = `%${search}%`
  const direction = order === 'desc' ? sql`desc` : sql`asc`

  return sql`
    select
      s.id, s.name, s.address,
      round(avg(r.rating), 1)::float as overall_rating,
      max(r.rating) filter (where r.user_id = ${userId}) as user_rating
    from stores s
    left join ratings r on r.store_id = s.id
    where s.name ilike ${pattern} or s.address ilike ${pattern}
    group by s.id
    order by ${sql(SORT_COLUMNS[sortBy])} ${direction} nulls last`
}

export async function rateStore(userId, storeId, rating) {
  const [store] = await sql`select id from stores where id = ${storeId}`
  if (!store) {
    throw new AppError(404, 'Store not found')
  }

  const [saved] = await sql`
    insert into ratings (user_id, store_id, rating)
    values (${userId}, ${storeId}, ${rating})
    on conflict (user_id, store_id)
    do update set rating = excluded.rating, updated_at = now()
    returning store_id, rating`

  return saved
}
