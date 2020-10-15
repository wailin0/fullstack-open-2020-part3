const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]


const url =
    `mongodb://fullstackopen2020:${password}@cluster0-shard-00-00.tubrz.mongodb.net:27017,cluster0-shard-00-01.tubrz.mongodb.net:27017,cluster0-shard-00-02.tubrz.mongodb.net:27017/phonebook?ssl=true&replicaSet=atlas-4etfa8-shard-0&authSource=admin&retryWrites=true&w=majority`

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true})

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('person', personSchema)


if (!process.argv[3]) {
    Person.find({}).then((result) => {
        console.log('Phonebook:')
        result.forEach((person) => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
        process.exit(1)
    })
}

const person = new Person({
    name: name,
    number: number
})


person.save().then(result => {
    console.log(`added ${name} number ${number} to phonebook!`)
    mongoose.connection.close()
})