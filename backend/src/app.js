import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import sql from './db/db.js'
import errorHandler from './middleware/errorHandler.js'


const app = express()

app.use(helmet())
app.use(cors({origin: 'http://localhost:5173',credentials:true }))
app.use(express.json())
app.use(cookieParser())

app.get('/api/health',async(req,res)=>{
    const [row]= await sql`select now()`
    res.json({ ok:true, dbTime:row.now})
})

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

app.use(errorHandler)

export default app