const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  brand: String,
  model: String,
  price: Number,
  category: String,
  description: String,
  specs: {
    ram: String,
    storage: String,
    processor: String,
    gpu: String,
  },
  rating: Number,
  stock: Number,
  images: [String],
});

module.exports = mongoose.model('Product', ProductSchema);
