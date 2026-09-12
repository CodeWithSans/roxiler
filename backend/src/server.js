import app from './app.js'

const required = ['DATABASE_URL', 'JWT_SECRET', 'CLIENT_URL']
for (const key of required) {
  if (!process.env[key]) {
    console.error(`Missing ${key} in .env`)
    process.exit(1)
  }
}

const PORT = process.env.PORT || 5000

app.listen(PORT,()=>{
console.log(`Server running on http://localhost:${PORT}`)
})