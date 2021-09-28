const express = require('express');
const app = express();
const config = require('./config/config.json');
const dotenv = require('dotenv');

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


//--------MONGO-------------
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

//---------Routers--------
const usersRouter = require('./routes/productos');
const messagesRouter = require('./routes/messages');
const carritoRouter = require('./routes/carrito');
const { async } = require('rxjs');

app.use('/api', usersRouter);
app.use('/api', messagesRouter);
app.use('/api', carritoRouter);
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
var carrito = []//carrito de compras

const factory = require("./repository/factory");
const persistenciaTipo = require("./config/config.json").persistencia; 

//variable para cargar las base de datos
const loadData = ( async () => {    
    
        let Persistencia = factory.getPersistencia(persistenciaTipo);
        let instancia = new Persistencia();
        data = await instancia.leer(data, "productos"); //pasamos un string para que cargue o mensajes o productos  
        chat =await instancia.leer(chat, "chat"); 

})



//cargamos nuestros articulos y mensajes al entrar en la Home
app.get('/', async (req, res) => {  
 try{
    await loadData();//cargamos la base de datos
    
    res.render('main', { productos: data , hayProductos: false });
    
 }catch{
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
                let Persistencia = factory.getPersistencia(persistenciaTipo);
                let instancia = new Persistencia();
                await instancia.guardar(data, "productos");
            }catch(error){
             console.log("Fallo cargar nuevo producto")
            }        
        })();                
        io.sockets.emit('productos', data);
    });
    //Mensajes del chat
    socket.on('nuevo-mensaje', mensaje => {
        chat.push(mensaje);
        mensaje.id = chat.length + 1;               
       
        (async () => {
            try{
                
                let Persistencia = factory.getPersistencia(persistenciaTipo);
                let instancia = new Persistencia();
                await instancia.guardar(chat, "chat");
                
            }catch(error){
             console.log("Fallo cargar nuevo mensaje")
            }        
        })();      
        io.sockets.emit('mensajes', chat)
        
    })

    //recibo un articulo del carrito
    socket.on('articuloCarrito', productoAgregado => {                 
        
        articulo = {             
            timeStamp: new Date().toLocaleString(),
            producto: productoAgregado.title
        }
        carrito.push(articulo);
        (async () => {
            try{
                let Persistencia = factory.getPersistencia(persistenciaTipo);
                let instancia = new Persistencia();
                await instancia.guardar(articulo, "carrito");
            }catch(error){
             console.log("Fallo cargar articulo nuevo en carrito")
            }        
        })();      
    })

});
