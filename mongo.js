const mongoose = require("mongoose")

if (process.argv.length < 3) {
  console.log("give password as argument")
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0-ppwfu.mongodb.net/pluettelo-app?retryWrites=true`
const personSchema = new mongoose.Schema({
  id: Number,
  name: String,
  number: String
})

const Person = new mongoose.model("Person", personSchema)

const person = new Person({
  id: Math.floor(Math.random() * 10000),
  name: process.argv[3],
  number: process.argv[4]
})

mongoose.connect(url, { useNewUrlParser: true })

if (process.argv.length === 5) {
  person.save().then(res => {
    console.log(
      `lisätään ${process.argv[3]} numero ${process.argv[4]} luetteloon`
    )
    mongoose.connection.close()
  })
} else if (process.argv.length === 3) {
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })
}
