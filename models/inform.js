const mongoose = require('mongoose')
const Schema = mongoose.Schema
const informSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    faculty: {
        type: Number,
        required: true
    },
    createAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Inform', informSchema)