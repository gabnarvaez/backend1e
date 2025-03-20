const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    category: String,
    availability: { type: Boolean, default: true }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
