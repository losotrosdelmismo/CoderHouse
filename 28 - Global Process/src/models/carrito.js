const mongoose = require('mongoose');

const Carrito = mongoose.Schema({
    id: {type: Number, require: false}, 
    date: { type: String, max: 255 },
    producto: { type: String, max: 255 },
    
});

const carrito = mongoose.model('carrito', Carrito);

module.exports = carrito;