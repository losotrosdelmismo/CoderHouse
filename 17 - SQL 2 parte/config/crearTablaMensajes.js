const express = require('express');
const fs = require('fs');

const options = require('./dataBase');
const knex = require('knex')(options);
//leemos los mensajes del desafio anterior
const mensajes = JSON.parse(fs.readFileSync('../mensajes.txt'))

//creamos la tabla
knex.schema.createTable('mensajes', table => {    
    table.string('autor');
    table.string('date');
    table.string('texto');
}).then(() => {
    console.log('tabla mensajes creada!');
}).catch(error => {
    console.log('error:', error);
    throw error;
}).finally(() => {
    console.log('cerrando conexion...');
    knex.destroy();
});

knex('mensajes').insert(mensajes)
.then(() => {
    console.log('autos agregados a la tabla');
}).catch(error => {
    console.log('error:', error);
}).finally(() => {
    console.log('cerrando conexion...');
    knex.destroy();
});

