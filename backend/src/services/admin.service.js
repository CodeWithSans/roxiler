import sql from '../db/db.js'

export async function getDashboardStats() {
  const [stats] = await sql`
    select
      (select count(*) from users)::int   as total_users,
      (select count(*) from stores)::int  as total_stores,
      (select count(*) from ratings)::int as total_ratings`

  return stats
}
