const mongoose = require('mongoose');

const mensajes = mongoose.Schema({    
    autor: { type: String, require: true, max: 100 },
    date: { type: Date, default: new Date() },
    texto: { type: String, max: 400 },
    id: {type: Number, require: false}
});

const Message = mongoose.model('mensajes', mensajes);

module.exports = Message;