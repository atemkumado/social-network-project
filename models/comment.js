const mongoose = require('mongoose')
const Schema = mongoose.Schema
const commentSchema = new Schema({
    article_id: {
        type: String,
        required: true
    },
    user_cmt: {
        type: String,
        required: true
    },
    user_avt: {
        type: String,
    },
    content: {
        type: String,
        required: true
    },

    createAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Comment', commentSchema)