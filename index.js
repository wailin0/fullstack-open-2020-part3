require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/persons')
app.use(express.json())
app.use(cors())
app.use(express.static('build'))
morgan.token('person', (req) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
  return null
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'))


app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body

  if (!body.name) {
    return res.status(400).json({error: 'name is required'})
  }
  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save()
    .then(response => {
      res.status(201).json(response.toJSON())
    })
    .catch(error => next(error))
})


app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(req.params.id, person, {new: true})
    .then(result => {
      res.json(result)
    })
    .catch(error => next(error))
})


const errorHandler = (error, request, response, next) => {
  console.error(error.name)

  if (error.name === 'CastError') {
    return response.status(400).send({error: 'wrong id'})
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({error: error.message})
  } else if (error.name === 'MongoError') {
    return response.status(409).json({error: error.message})
  }

  return next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})