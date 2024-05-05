const logger = require('./logger')
const morgan = require('morgan')

const customFormatter = (tokens, req, res) => {
  let formatterArray = [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'),
    '-',
    tokens['response-time'](req, res), 
    'ms'
  ]
  
  if (req.method === 'POST') {
    formatterArray.push('-')
    formatterArray.push(JSON.stringify(req.body))
  }
  
  return formatterArray.join(' ')
}

const requestLogger = morgan(customFormatter)

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'Unknown endpoint' })
}
  
const errorHandler = (error, request, response, next) => {
  console.error(error.message)
    
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  
  next(error)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler
}