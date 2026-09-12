import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import sql from './db/db.js'

const app = express()

app.use(helmet())
app.use(cors({origin: 'http://localhost:5173',credentials:true }))
app.use(express.json())
app.use(cookieParser())

app.get('/api/health',async(req,res)=>{
    const [row]= await sql`select now()`
    res.json({ ok:true, dbTime:row.now})
})
export default app