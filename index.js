const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const morgan = require("morgan")
const cors = require("cors")

app.use(cors())
app.use(bodyParser.json())
morgan.token("datalogger", function(req, res) {
  return JSON.stringify(req.body)
})
app.use(morgan(":method :url :response-time ms :datalogger"))

app.get("/api/persons", (req, res) => {
  res.json(luettelo)
})

app.get("/info", (req, res) => {
  res.send(
    `   <div>
        <p>Puhelinluettelossa ${luettelo.length} henkilön tiedot</p>
        <p>${new Date()}<p/>
        </div>`
  )
})

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id)
  const person = luettelo.find(person => person.id === id)
  res.json(person)
})

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id)
  luettelo = luettelo.filter(person => person.id !== id)

  res.status(204).end()
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

  const person = {
    id: Math.floor(Math.random() * 10000),
    name: body.name,
    number: body.number
  }

  luettelo = luettelo.concat(person)

  res.json(person)
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
    name: "rottajulli",
    number: "vitun rotta"
  },
  {
    id: 4,
    name: "Hernik lahje",
    number: "fleimaaja :^)"
  }
]

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
