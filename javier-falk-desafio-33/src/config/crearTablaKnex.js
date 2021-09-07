const express = require('express');
const options = require('./dataBase');
const knex = require('knex')(options);


//creamos la tabla
    knex.schema.createTable('chat', table => {    
        table.string('autor');
        table.string('date');
        table.string('texto');
        table.integer("id")
    }).then(() => {
        console.log('tabla mensajes creada!');
    }).catch(error => {
        console.log('error:', error);
        throw error;
    }).finally(() => {
        console.log('cerrando conexion...');
        knex.destroy();
    });

    knex.schema.createTable('productos', table => {    
        table.string('title');
        table.integer('price');
        table.string('thumbnail');
        table.integer('id');
        table.string('actualizado');
    }).then(() => {
        console.log('tabla productos creada!');
    }).catch(error => {
        console.log('error:', error);
        throw error;
    }).finally(() => {
        console.log('cerrando conexion...');
        knex.destroy();
    });


knex.schema.createTable('carrito', table => {   
    table.increments('id');
    table.string('timeStamp');
    table.string('producto'); 
}).then(() => {
    console.log('tabla carrito creada!'); 
}).catch(error => {
    console.log('error:', error);
    throw error;
}).finally(() => {
    console.log('cerrando conexion...');
    knex.destroy();
});





