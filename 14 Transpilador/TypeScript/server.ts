const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const puerto = 8080;

app.use(express.static('public'));

app.get('/sumar/:num1/:num2', (req, res) => {
   let suma = parseInt(req.params.num1) + parseInt(req.params.num2)
     res.send('RESULTADO: '+ suma)
});

app.get('/resta/:num1/:num2', (req, res) => {
  let resta = parseInt(req.params.num1) - parseInt(req.params.num2)
    res.send('RESULTADO: '+ resta)
});

const server = app.listen(puerto, () => {
    console.log(`servidor escuchando en http://localhost:${puerto}`);
});

server.on('error', error => {
    console.log('error en el servidor:', error);
});