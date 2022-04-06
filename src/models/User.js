const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 20,
        unique: true
    },
    address: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 50,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 8,
    },
    admin: {
        type: Boolean,
        default: false
    }
}, {timestamps: true})

module.exports = mongoose.model('User', userSchema)

