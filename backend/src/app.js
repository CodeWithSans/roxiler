import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import sql from './db/db.js'
import errorHandler from './middleware/errorHandler.js'
import authRoutes from './routes/auth.routes.js'
import storeRoutes from './routes/store.routes.js'
import adminRoutes from './routes/admin.routes.js'


const app = express()

app.use(helmet())
app.use(cors({origin: 'http://localhost:5173',credentials:true }))
app.use(express.json())
app.use(cookieParser())

app.get('/api/health',async(req,res)=>{
    const [row]= await sql`select now()`
    res.json({ ok:true, dbTime:row.now})
})

app.use('/api/auth', authRoutes)
app.use('/api/stores', storeRoutes)
app.use('/api/admin', adminRoutes)

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

app.use(errorHandler)

export default app