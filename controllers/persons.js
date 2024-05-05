const personsRouter = require('express').Router()
const Person = require('../models/person')
  
personsRouter.post('/', (request, response, next) => {
  const contact = request.body
  console.log(`New contact: ${JSON.stringify(contact)}`)
  
  const newContact = new Person({
    name: contact.name,
    number: contact.number
  })
  
  newContact.save()
    .then(savedContact => {
      response.json(savedContact)
    })
    .catch(error => next(error))
})
  
personsRouter.get('/', (request, response, next) => {
  Person.find({})
    .then(result => {
      response.json(result)
    })
    .catch(error => next(error))
})
  
personsRouter.get('/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(contact => {
      if (contact) {
        response.json(contact)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})
  
personsRouter.delete('/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      if (result) {
        response.status(204).end()
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})
  
personsRouter.put('/:id', (request, response, next) => {
  const { name, number } = request.body
    
  const person = {
    name: name,
    number: number,
  }
    
  Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true, context: 'query'})
    .then(updatedContact => {
      response.json(updatedContact)
    })
    .catch(error => next(error))
})

module.exports = personsRouter