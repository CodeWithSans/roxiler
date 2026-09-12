import sql from './db.js'             
await sql.file('src/db/schema.sql')    
console.log('Schema applied')         
await sql.end()                      