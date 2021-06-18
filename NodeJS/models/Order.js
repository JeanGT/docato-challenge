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
},
{
    timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);