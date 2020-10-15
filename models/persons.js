const mongoose = require('mongoose')


const url = process.env.MONGODB_URI

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true})
    .then(res => console.log("connected " + res))
    .catch(e => console.log("error connecting " + e))

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        unique: true,
        required: true
    },
    number: {
        type: String,
        minlength: 8,
        required: true
    }
})


module.exports = mongoose.model('person', personSchema)
