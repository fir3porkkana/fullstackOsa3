if (process.env.NODE_ENV !== "production") {
  require("dotenv").config()
}
const express = require("express")
const bodyParser = require("body-parser")
const app = express()
const Person = require("./models/person")
const morgan = require("morgan")
const cors = require("cors")

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === "CastError" && error.kind === "ObjectId") {
    return res.status(400).send({ error: "malformatted id" })
  } else if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message })
  }
  next(error)
}

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" })
}

app.use(cors())
app.use(express.static("build"))
app.use(bodyParser.json())
morgan.token("datalogger", function(req, res) {
  return JSON.stringify(req.body)
})
app.use(morgan(":method :url :response-time ms :datalogger"))

app.get("/api/persons", (req, res) => {
  Person.find({})
    .then(persons => {
      res.json(persons.map(person => person.toJSON()))
    })
    .catch(error => {
      console.log("request failed: ", error.message)
      res.status(404).end()
    })
})

app.get("/info", (req, res) => {
  Person.find({}).then(persons => {
    res.send(
      `   <div>
            <p>Puhelinluettelossa ${persons.length} henkilön tiedot</p>
            <p>${new Date()}<p/>
            </div>`
    )
  })
})

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person.toJSON())
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.post(`/api/persons`, (req, res) => {
  const body = req.body
  console.log("näin sitä pyörää ajetaan", body)

  if (body.number === undefined) {
    return res.status(400).json({
      error: "number missing"
    })
  }

  if (body.name === undefined) {
    return res.status(400).json({
      error: "name missing"
    })
  }

  if (luettelo.map(person => person.name).includes(body.name)) {
    return res.status(400).json({
      error: "name must be unique"
    })
  }

  const person = new Person({
    id: Math.floor(Math.random() * 10000),
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    res.json(savedPerson.toJSON)
  })
})

app.put("/api/notes/:id", (req, res, next) => {
  const body = req.body

  const person = {
    id: req.params.id,
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(req.params.id, person)
    .then(updatedPerson => {
      res.json(updatedPerson.toJSON())
    })
    .catch(error => next(error))
})

let luettelo = [
  {
    id: 1,
    name: "Erkki Pyykköne",
    number: 32
  },
  {
    id: 2,
    name: "Kebon Honn",
    number: 2
  },
  {
    id: 3,
    name: "Hernik lahje",
    number: "1312"
  },
  {
    id: 4,
    name: "testi",
    number: "123454321"
  }
]
app.use(unknownEndpoint)
app.use(errorHandler)
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
