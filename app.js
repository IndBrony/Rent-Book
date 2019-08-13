require('dotenv').config()

const express = require('express')
const app = express()
const bodyparser = require('body-parser')
const logger = require('morgan')

const bookRoute = require('./src/routes/books')
const genreRoute = require('./src/routes/genres')
const borrowingRoute = require('./src/routes/borrowings')

const port = process.env.SERVER_PORT || 3000

app.listen(port, () => {
    console.log(`Server is running at port ${port}`)
})
app.use(logger('dev'))
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended:false}))

app.use('/books', bookRoute)
app.use('/genres', genreRoute)
app.use('/borrowings', borrowingRoute)