const express = require('express');
const app = express();
const config = require('./config/config.json');
//const dotenv = require('dotenv');

//parametros para los productos y mensajes en mongo
const productosModels = require('./models/productos');
const productos = require('./persistencia/productos.json');
const mensajes = require('./persistencia/mensajes.json');
const mensajesModels = require('./models/message')


//Iniciamos Web Socket
const http = require('http').Server(app);
const io = require('socket.io')(http);

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

require('./database/connection');

// obtengo la config del .env
//dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// protejo el servidor ante cualquier excepcion no atrapada
app.use((err, req, res, next) => {
    console.error(err.message);
    return res.status(500).send('Algo se rompio!');
});

//---------cosas del profe
const usersRouter = require('./routes/productos');
const messagesRouter = require('./routes/messages');
const { async } = require('rxjs');
const { model } = require('./api/productos');
app.use('/api', usersRouter);
app.use('/api', messagesRouter);
//---------------------------------------------------------

//obtenemos el puerto desde el config.json
const PORT = process.env.PORT || config.PORT;
http.listen(PORT, () => {
    console.log(`servidor escuchando en http://localhost:${PORT}`);
});
// en caso de error, avisar
http.on('error', error => {
    console.log('error en el servidor:', error);
});

var data = [];//variable donde guardo los productos
var chat = [] //Mensajes en el servidor

//cargamos nuestros articulos y mensajes al entrar en la Home
app.get('/', async (req, res) => {

    try{
        //si la base en mongo no esta busca el json con la persistencia local y crea la base en mongo        
        data = await productosModels.find(); 
        if(data.length == 0){
            await productosModels.create(productos);
            data = await productosModels.find();
        }

        chat = await mensajesModels.find()
        if(chat.length == 0){
            await mensajesModels.create(mensajes);
            chat = await mensajesModels.find();
        }       
        
    }catch{
        
        console.log("base de datos no conectada")
    }   
    
   

    if(data.length == 0){
        res.render('main', { productos: data , hayProductos: false });
    }
    else{           
        res.render('main', { productos: data , hayProductos: true });     
                          
    }

})

//WebSocket espera conexion del cliente
io.on('connect', socket => {
    console.log('usuario conectado');
    socket.emit('productos', data);
    //Emito mis mensajes, mando los mensajes al socket cliente y desde ahi dibujo los mensajes
    socket.emit('mensajes', chat);

    // recibo un evento del cliente, con su correspondiente dato
    socket.on('producto-nuevo', productoNuevo => {        
        productoNuevo.id = data.length + 1;
        data.push(productoNuevo);   
        (async () => {
            try{
                await productosModels.create(data);
            }catch(error){
             console.log("cargar nuevo producto")
            }        
        })();                
        io.sockets.emit('productos', data);
    });
    //Mensajes del chat
    socket.on('nuevo-mensaje', mensaje => {
        mensaje.id = chat.length + 1;
        chat.push(mensaje);       
       
       (async () => {
           try{
            await mensajesModels.create(chat);
           }catch(error){
            console.log("fallo carga del mensaje en knex")
           }        
       })();    
         
        io.sockets.emit('mensajes', chat)
    })
});

const faker = require('faker');
faker.locale = 'es';

app.get('/productos/vista', async (req, res) => {
    let num = req.query.num || 10;
    if(num < 1){
        res.send("no hay productos!!")
    }
    let obj = [];
    
    for (let i = 0; i < num; i++) {
         obj.push( {titulo: faker.commerce.product(), 
            precio: faker.commerce.price(), 
            imagen: faker.commerce.product()
        })
    }   
    
    res.json({obj})
    
});

