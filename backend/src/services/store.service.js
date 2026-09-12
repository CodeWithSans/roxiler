import sql from '../db/db.js'

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
