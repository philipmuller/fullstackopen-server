const config = require('./utils/config')
const logger = require('./utils/logger')
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const personsRouter = require('./controllers/persons')
const middleware = require('./utils/middleware')

mongoose.set('strictQuery', false)

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/persons', personsRouter)

app.get('/', (request, response) => {
  response.send('<h1>If this gets shown, something went wrong! Failed to fetch react frontend</h1>')
})

app.get('/info', (request, response) => {
  Person.find({})
    .then(result => {
      const firstLineContent = `Phonebook has info for ${result.length} people`
      const secondLineContent = new Date()
      response.send(`<p>${firstLineContent}<br/><br/>${secondLineContent}</p>`)
    })
})

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app