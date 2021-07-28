const productos = require('../models/productos');
const MongoCRUD = require('../repository/crud');

class productosController extends MongoCRUD {

    constructor() {
        super(productos);
    }
    
    async desnormalizar(data){
        const { denormalize, schema } = require('normalizr');
const fs = require('fs');
const normalizado = require('../desafio1/normalizado.json');

const mensaje = new schema.Entity('chat');

const mensajito = new schema.Entity('chateando', {
    autor: data.autor,        
    avatar: data.avatar,        
    texto: data.texto
    
});

const desnormalizado = denormalize(data, mensajito, data);

return desnormalizado;
}
    
}

module.exports = new productosController();