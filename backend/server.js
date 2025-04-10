const path = require('path')
const express = require('express')
const colors = require('colors')
const morgan = require('morgan')
const dotenv = require('dotenv').config()
const { errorHandler } = require('./middleware/errorMid')
const connectDB = require('./config/db')
const cors = require('cors')
// const throng = require('throng')
// const WORKERS = process.env.WEB_CONCURRENCY ?? 1
const PORT = process.env.PORT ?? 5000
console.log(process.env.YT_VID_URL);

connectDB()

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(morgan('tiny'))
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
}))

// Routes
app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/youtube', require('./routes/youtubeRoutes'))

// Serve Frontend
if (process.env.NODE_ENV === 'production') {
  // // Set build folder as static
  // app.use(express.static(path.join(__dirname, '../frontend/build')))

  // // FIX: below code fixes app crashing on refresh in deployment
  // app.get('*', (_, res) => {
  //   res.sendFile(path.join(__dirname, '../frontend/build/index.html'))
  // })
} 

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to the Cosight API' })
})

app.use(errorHandler)

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
