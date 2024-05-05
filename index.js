require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

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

app.use(express.static('dist'))
app.use(cors())
app.use(express.json())
app.use(morgan(customFormatter))

let contacts = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
  response.send('<h1>If this gets shown, something went wrong!</h1>')
})

app.get('/info', (request, response) => {
    const firstLineContent = `Phonebook has info for ${contacts.length} people`
    const secondLineContent = new Date()
    response.send(`<p>${firstLineContent}<br/><br/>${secondLineContent}</p>`)
})

function generateId() {
    const randomNum = Math.random() * 1000000
    const randomInt = Math.floor(randomNum)

    const finalId = randomInt

    if (contacts.find(contact => contact.id === finalId)) {
        return generateId() //calling itself recursively until a unique id is generated, a bit dangerous but should be fine
    }

    return finalId
}

app.post('/api/persons', (request, response) => {
    const contact = request.body
    console.log(`New contact: ${JSON.stringify(contact)}`)

    if (!contact.name || !contact.number || contact.name === '' || contact.number === '') {
        return response.status(400).json({ 
            error: 'Name or number missing' 
        })
    }

    if (contacts.find(cntct => cntct.name === contact.name)) {
        return response.status(400).json({ 
            error: 'Name already exists in the phonebook' 
        })
    }

    const newContact = new Person({
        name: contact.name,
        number: contact.number
    })

    newContact.save().then(savedContact => {
        response.json(savedContact)
    })
})

app.get('/api/persons', (request, response) => {
    Person.find({})
    .then(result => {
        response.json(result)
    })
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id)
    .then(contact => {
        if (contact) {
            response.json(contact)
        } else {
            response.status(404).end()
        }
    })
    .catch(error => {
        response.status(404).end()
    })

    // const id = Number(request.params.id)
    // const contact = contacts.find(cntct => cntct.id === id)
  
    // if (contact) {
    //     response.json(contact)
    // } else {
    //     response.status(404).end()
    // }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const filteredContacts = contacts.filter(contact => contact.id !== id)

    if (filteredContacts.length === contacts.length) {
        response.status(404).end()
    } else {
        contacts = filteredContacts
        response.status(204).end()
    }
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'Unknown endpoint' })
}
  
app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})