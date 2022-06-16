const mongoose = require('mongoose');

const productSchema = mongoose.Schema({

    name: {
        type: String,
        required: [true, 'Please enter valid product name']
    },

    description: {
        type: String,
        required: [true, 'Product description is required']
    },

    price: {
        type: Number,
        required: [true, 'Product price is required']
    },

    coverImage: {
        type: String
    },
    allImage: {
        type: [String]
    },

    numberInStock: {
        type: Number,
        required: [true, 'Quantity of product in stock is require']
    },

    isDiscounted: {
        type: Boolean,
        default: false
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})


module.exports = mongoose.model('Product', productSchema);