import sql from '../db/db.js'

const RATER_SORT = {
  name: 'u.name',
  email: 'u.email',
  rating: 'r.rating',
  date: 'r.updated_at',
}

export async function getOwnerDashboard(ownerId, { sortBy, order }) {
  const direction = order === 'desc' ? sql`desc` : sql`asc`

  const stores = await sql`
    select s.id, s.name,
      round(avg(r.rating), 1)::float as average_rating,
      count(r.id)::int as total_ratings
    from stores s
    left join ratings r on r.store_id = s.id
    where s.owner_id = ${ownerId}
    group by s.id
    order by s.name`

  const raters = await sql`
    select u.name, u.email, r.rating, r.updated_at as rated_at, s.name as store_name
    from ratings r
    join stores s on s.id = r.store_id
    join users u on u.id = r.user_id
    where s.owner_id = ${ownerId}
    order by ${sql(RATER_SORT[sortBy])} ${direction}`

  return { stores, raters }
}
