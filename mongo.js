const mongoose = require('mongoose')

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})
  
const Person = mongoose.model('Person', personSchema)

console.log(process.argv)

if (process.argv.length<3) {
  console.log('give password as first argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://philipmuller:${password}@fullstack.dvpjtmt.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)

mongoose.connect(url)

if (process.argv.length === 3) { //only password given
  listAll()
} else {
  if (process.argv.length < 5) {
    console.log('Please provide the name and number as arguments')
    process.exit(1)
  }

  const nm = process.argv[3]
  const nmbr = process.argv[4]

  console.log(`Adding ${nm} number ${nmbr} to phonebook...`)

  saveNewPerson(nm, nmbr)
}

function saveNewPerson(name, number) {
  const person = new Person({
    name: name,
    number: number,
  })
    
  person.save().then(result => {
    console.log(`Added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
}

function listAll() {
  console.log('Phonebook:')
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })
}