const mongoose = require('mongoose')
const Schema = mongoose.Schema

const articleSchema = new Schema({
    user_id: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        required: true,
    },
    content: {
        type: String
    },
    image: {
        type: Buffer
    },
    imageType: {
        type: String
    },
    createAt: {
        type: Date,
        default: Date.now
    }
})

articleSchema.virtual('imageSrc').get(function () {
    if (this.image != null && this.imageType != null) {
        return `data:${this.imageType};charset=utf-8;base64,${this.image.toString('base64')}`
    }
})

module.exports = mongoose.model('Article', articleSchema)