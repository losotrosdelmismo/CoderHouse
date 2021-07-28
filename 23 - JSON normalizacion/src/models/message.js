const mongoose = require('mongoose');

const mensajes = mongoose.Schema({   
    id: { type: Number },  
    autor: { type: String, require: true, max: 100 },
    nombre: { type: String, require: true, max: 100 },
    apellido: { type: String, require: true, max: 100 },
    edad: { type: String, require: true, max: 100 },
    avatar: { type: String, require: true, max: 100 },
    alias: { type: String, require: true, max: 100 },
    texto: { type: String, max: 400 }    
});

const Message = mongoose.model('mensajes', mensajes);

module.exports = Message;