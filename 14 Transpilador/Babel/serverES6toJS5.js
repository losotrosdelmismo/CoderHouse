'use strict';

var express = require('express');
var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var puerto = 8080;

app.use(express.static('public'));

app.get('/sumar/:num1/:num2', function (req, res) {
    suma = parseInt(req.params.num1) + parseInt(req.params.num2);
    res.send('RESULTADO: ' + suma);
});

app.get('/resta/:num1/:num2', function (req, res) {
    resta = parseInt(req.params.num1) - parseInt(req.params.num2);
    res.send('RESULTADO: ' + resta);
});

var server = app.listen(puerto, function () {
    console.log('servidor escuchando en http://localhost:' + puerto);
});

server.on('error', function (error) {
    console.log('error en el servidor:', error);
});
