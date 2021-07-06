const express = require('express');
const { async } = require('rxjs');
const productos = require('./productos');
// creo una app de tipo express
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const fs = require('fs');
//Iniciamos Web Socket
const http = require('http').Server(app);
const io = require('socket.io')(http);
const puerto = 8080;
http.listen(puerto, () => {
    console.log(`servidor escuchando en http://localhost:${puerto}`);
});
// en caso de error, avisar
http.on('error', error => {
    console.log('error en el servidor:', error);
});
//HandleBars

const handlebars = require('express-handlebars');

app.engine('hbs', handlebars({
    extname: '.hbs',//extension
    defaultLayout: 'index.hbs',//pagina por defecto
    layoutsDir: __dirname + '/views/layouts',//dir layouts
    partialsDir: __dirname + '/views/partials/'//dir partials
}));

// seteo el motor de plantilla
app.set('view engine', 'hbs');
app.set('views', './views');

app.use(express.static(__dirname + '/public'));

var data = [];//variable donde guardo los productos.
var mensajes = [] //Mensajes en el servidor

//---------KNEX--------------
const options = require('./config/dataBase');
const knex = require('knex')(options);

app.get('/', async (req, res) => {
    //segun que string se pase productos.leer levanta los mensajes o los productos
    data = await productos.leer(data, 'productos');   
    //mensajes = await productos.leer(mensajes, 'mensajes');
    mensajes = await knex 
        if(data.length == 0){
            res.render('main', { productos: data , hayProductos: false });
        }
        else{           
            res.render('main', { productos: data , hayProductos: true });                       
        }
});

//WebSocket espera conexion del cliente
io.on('connect', socket => {
    console.log('usuario conectado');
    socket.emit('productos', data);
    //Emito mis mensajes
    socket.emit('mensajes', mensajes);

    // recibo un evento del cliente, con su correspondiente dato
    socket.on('producto-nuevo', productoNuevo => {        
        p.id = data.length + 1;
        data.push(productoNuevo);   
        fs.writeFileSync('./productos.txt', JSON.stringify(data, null, '\t'));             
        io.sockets.emit('productos', data);
    });
    //Mensajes del chat
    socket.on('nuevo-mensaje', mensaje => {
        mensajes.push(mensaje);
        fs.writeFileSync('./mensajes.txt', JSON.stringify(mensajes, null, '\t'));    
        io.sockets.emit('mensajes', mensajes)
    })
});





