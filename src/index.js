const express =  require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const dotenv = require('dotenv')

const authRoute = require('./routes/auth.route')

const app = express()
const PORT = 8000
dotenv.config()

mongoose.connect(process.env.DB_URL, () => {
    console.log("Connected database!!!")
})

app.use(cors())
app.use(cookieParser())
app.use(express.json())

// ROUTES
app.use("/v1/auth", authRoute)

app.listen(PORT, () => {
    console.log(`Server is running at: http://localhost:${PORT}`)
})