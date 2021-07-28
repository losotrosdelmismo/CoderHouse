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
console.log(JSON.stringify(desnormalizado, null, 3));
fs.writeFileSync('./desnormalizado.json', JSON.stringify(desnormalizado, null, 3));



    


console.log(desnormalizado)