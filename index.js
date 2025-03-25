
import express from 'express'
import mongoose from 'mongoose'
import connectDb from './config/dbConfig.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import itemRouter from './routes/item.router.js'
import authRouter from './routes/auth.router.js'
import adminRouter from './routes/admin.router.js'
import imageRouter from './routes/image.router.js'

const app = express()
app.use(express.json())

app.use(cors())

app.use(cookieParser())
const port = process.env.PORT || 4040

connectDb()
const db = mongoose.connection;

app.get('/', (req, res) => {
    res.send('Pin at Ranchi admin server')
})

app.use('/api/auth', authRouter)
app.use('/api/item', itemRouter)
app.use('/api/admin', adminRouter)
app.use('/api/image', imageRouter)

db.once('open', () => {
    console.log('\x1b[36m%s\x1b[0m', '----------------------------------------------------------------------------------------')
    console.log('\x1b[36m%s\x1b[0m', 'DB connection successful')
    app.listen(port, () => {
        console.log('\x1b[36m%s\x1b[0m', `Pin at Ranchi server is listening on port ${port}`)
        console.log('\x1b[36m%s\x1b[0m', '----------------------------------------------------------------------------------------')
    })
})