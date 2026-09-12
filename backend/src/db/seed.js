import bcrypt from 'bcrypt'
import sql from './db.js'

const hash = await bcrypt.hash('Test@1234', 10)

const users = [
  { name: 'System Administrator Account', email: 'admin@test.com',  role: 'ADMIN' },
  { name: 'Ramesh Kumar Store Owner One', email: 'owner1@test.com', role: 'OWNER' },
  { name: 'Suresh Patil Store Owner Two', email: 'owner2@test.com', role: 'OWNER' },
  { name: 'Priya Sharma Normal User One', email: 'user1@test.com',  role: 'USER'  },
]

for (const u of users) {
  await sql`
    insert into users (name, email, password_hash, address, role)
    values (${u.name}, ${u.email}, ${hash}, 'Pune, Maharashtra', ${u.role})
    on conflict (email) do nothing`
}

const [owner1] = await sql`select id from users where email = 'owner1@test.com'`
const [owner2] = await sql`select id from users where email = 'owner2@test.com'`
const [user1]  = await sql`select id from users where email = 'user1@test.com'`

await sql`
  insert into stores (name, email, address, owner_id) values
  ('Fresh Mart Grocery', 'freshmart@test.com', 'FC Road, Pune', ${owner1.id}),
  ('City Electronics Hub', 'cityelec@test.com', 'MG Road, Pune', ${owner2.id})
  on conflict (email) do nothing`

const [store1] = await sql`select id from stores where email = 'freshmart@test.com'`

await sql`
  insert into ratings (user_id, store_id, rating)
  values (${user1.id}, ${store1.id}, 4)
  on conflict (user_id, store_id) do nothing`

console.log('Seed done')
await sql.end()
