const express = require('express')
const app = express()

app.use(express.json())

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
  response.send('<h1>Hello World!</h1>')
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

    const newContact = {
        id: generateId(),
        name: contact.name,
        number: contact.number
    }

    contacts = contacts.concat(newContact)

    response.json(newContact)
})

app.get('/api/persons', (request, response) => {
  response.json(contacts)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const contact = contacts.find(cntct => cntct.id === id)
  
    if (contact) {
        response.json(contact)
    } else {
        response.status(404).end()
    }
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

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})