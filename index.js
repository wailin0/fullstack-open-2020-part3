const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()


app.use(express.json())
app.use(cors())
morgan.token('person', (req) => {
    if (req.method === 'POST') {
        return JSON.stringify(req.body)
    }
    return null
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'))

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "2019-05-30T17:30:31.098Z"
    },
    {
        id: 2,
        name: "Hada loverklace",
        number: "2019-05-30T17:30:31.098Z"
    },
    {
        id: 3,
        name: "dan abrnjvb",
        number: "2019-05-30T17:30:31.098Z"
    },
    {
        id: 4,
        name: "Nary popmenedivk",
        number: "2019-05-30T17:30:31.098Z"
    }

]

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(p => p.id === id)
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(p => p.id !== p)

    response.status(204).end()
})

const generateID = () => {
    return Math.floor(Math.random() * 1000)
}

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name) {
        return response.status(400).json({
            error: 'name missing'
        })
    } else if (!body.number) {
        return response.status(400).json({
            error: 'number missing'
        })
    }
    const existingName = persons.find(p => p.name === body.name)
    if(existingName){
        return response.status(409).json({
         error: 'name must be unique'
        })
    }
    console.log(body.name)
    console.log(existingName)
    const person = {
        id: generateID(),
        name: body.name,
        number: body.number
    }
    persons = persons.concat(person)

    response.json(person)
})

const now = new Date()

app.get('/info', (req, res) => {
    res.send('<p>Phonebook has info for ' + persons.length + ' people</p>' + now)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})