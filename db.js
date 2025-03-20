const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://gabsnarvaez17:6wDwcaFvqL8jI1s1@coderhouseentrega.4qewx.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=CoderhouseEntrega', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB conectado 🚀');
  } catch (error) {
    console.error('Error conectando a MongoDB:', error);
  }
};

module.exports = connectDB;
