const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        max: 255,
        min: 6
    },
    amount: {
        type: Number,
        required: true,
        max: 10,
        min: 0
    },
});

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        max: 255,
        min: 6
    },
    email: {
        type: String,
        required: true,
        max: 255,
        min: 6
    },
    password: {
        type: String,
        required: true,
        max: 1024,
        min: 6
    },
    orders: [orderSchema]
},
{
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);