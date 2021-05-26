const { randomInt } = require('crypto');
const express = require('express');
const app = express();
const fs = require('fs');
const puerto = 8080;

var contadoVisitasItems = 0;
var contadoVisitasRandom = 0;

const server = app.listen(puerto, () => {
    console.log(`servidor escuchando en http://localhost:${puerto}`);
});

server.on('error', error => {
    console.log('error en el servidor:', error);
});

app.get('/visitas', (req, res) => {
    res.send(`<p>Visitas en ITEMS: ${contadoVisitasItems}</p>
              <p>Visitas en ITEMS RANDOM: ${contadoVisitasRandom}</p>
    `);
})

app.get('/items', (req, res) => {
    contadoVisitasItems++;
    
   fs.readFile('./productos.txt', (error, data) => {     
        res.json({items: JSON.parse(data), cantidad: 1});      
   })
})

app.get('/items-random', (req, res) => {
    contadoVisitasRandom++;
    
    fs.readFile('./productos.txt', (error, data) => {
        const producto =  JSON.parse(data);
        let i = Math.floor(Math.random() * (producto.length - 0)) + 0;        
        res.json({item: producto[i]});           
    })    
 })


 


