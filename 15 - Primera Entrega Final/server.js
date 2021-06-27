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

//seteo el motor de plantilla
app.set('view engine', 'hbs');
app.set('views', './views');
//Carpeta public
app.use(express.static('./public'));
app.use(adminLogin)
//seteo routers
const productosRouter = express.Router();
const carritoRouter = express.Router();
app.use('/productos', productosRouter);
app.use('/carrito', carritoRouter);

var data = [];//variable donde guardo los productos
var mensajes = []; //Mensajes en el servidor
var carrito = []; //carrito de productos

//---middleware

var admin; //bool para verificar cuando es administrador
function adminLogin(req, res, next){
    admin = true;
    console.log('modo admin');
    next()
}



app.get('/', async (req, res) => {
    //segun que string se pase productos.leer levanta los mensajes, los productos y el carrito
    data = await productos.leer(data, 'productos');   
    mensajes = await productos.leer(mensajes, 'mensajes');
    carrito = await productos.leer(carrito, 'carrito');
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
    socket.on('producto-nuevo', p => {        
        p.id = data.length + 1;
        data.push(p);   
        fs.writeFileSync('./productos.json', JSON.stringify(data, null, '\t'));             
        io.sockets.emit('productos', data);
    });
    //Mensajes del chat
    socket.on('nuevo-mensaje', mensaje => {
        mensajes.push(mensaje);
        fs.writeFileSync('./mensajes.txt', JSON.stringify(mensajes, null, '\t'));    
        io.sockets.emit('mensajes', mensajes)
    })
    //recibo un articulo del carrito
    socket.on('articuloCarrito', p => {                    
        articulo = {
            id: carrito.length + 1,
            timeStamp: new Date().toLocaleString(),
            producto: p
        }
        carrito.push(articulo);   
        fs.writeFileSync('./carrito.txt', JSON.stringify(carrito, null, '\t'));
    })
});

productosRouter.get('/listar', async (req, res) =>{
    try{
        data = await productos.leer(data, 'productos');   
        if(data.length == 0){
            res.json({error:'no hay productos cargados'});
        }
        else{
            res.render('table', { productos: data , hayProductos: true });
        }                 
        
    }
    catch(error){
        console.log('fallo el listar')
    }
})

productosRouter.get('/listar/:id', async (req, res) =>{
    try{
        data = await productos.leer(data, 'productos');   
        if(data.length == 0){
            res.json({error:'no hay productos cargados'});
        }
        if(req.params.id - 1 > data.length){
            res.json({error:'Id inexistente'});
        }
        else{        
            let render = [];
            render.push(data[req.params.id - 1])
            res.render('table', { productos: render , hayProductos: true });
        }                 
        
    }
    catch(error){
        console.log('fallo el listar por ID')
    }
})

productosRouter.get('/agregar', async  (req, res) =>{
    try{
        if(admin){
            data = await productos.leer(data, 'productos');     
            p = req.body     
            res.render('form', { productos: data , hayProductos: true });
        }else{
            res.json({error: 'Tenes que tener derechos de administrador'})
        }   
       
    } 
    catch(error){
        console.log('fallo agregar');
    }
     
    }) 
     

productosRouter.post('/agregar/articulo', async  (req, res) =>{ 
    try{
        data = await productos.leer(data, 'productos');
        let producto = req.body;
        producto.id = data.length + 1
        producto.codigo = data.length;
        producto.timeStamp = new Date().toLocaleString();
        producto.stock = 10;
        p = await productos.guardar(data, producto);
        res.redirect('/productos/listar');
    } 
    catch{
        console.log('fallo al agregar articulo');
    }
   
})

productosRouter.put('/actualizar/:id', async (req, res) =>{
    try{
        if(admin){
        if(data.length == 0){
            data = await productos.leer(data);
        }        
        if(req.params.id > data.length || req.params.id == 0){
            res.json({error:'producto no encontrado'});
        }
        else{
            producto ={
                timeStamp: new Date().toLocaleString(),
                id: req.params.id                    
            } ;
            for(let d of data){
                if(d.id == producto.id){
                   
                }
            }
            data = data.map( d =>{
                if(d.id == producto.id){
                    d = Object.assign(d, producto);
                }
                return d;
            })
            
            productos.actualizarProductos(data, 'productos');            
            let render = [];
            render.push(data[req.params.id - 1]);
            res.render('table', { productos: render , hayProductos: true });
        }
        }else{
            res.json({error: 'Tenes que tener derechos de administrador'})
        }         
       
    }
    catch(error){
        console.log('fallo actualizar')
    }    
    
})

productosRouter.delete('/borrar/:id', async (req, res) =>{
    try{
        if(admin){
            if(data.length == 0){
                data = await productos.leer(data);
            }                 
            if(req.params.id > data.length || req.params.id == 0){
                res.json({error:'producto no encontrado'});
            }
            else{
            console.log(data)
              let borrado = data.splice(req.params.id - 1, 1)
              console.log(data)
              productos.actualizarProductos(data, 'productos');     
              res.render('table', { productos: borrado , hayProductos: true });
            }       
            res.render('form', { productos: data , hayProductos: true });
        }else{
            res.json({error: 'Tenes que tener derechos de administrador'})
        }   
        
    }
    catch(error){
        console.log('fallo borrar')
    }
    
})

carritoRouter.get('/listar', async (req, res) =>{
    try{
        carrito = await productos.leer(carrito, 'carrito');   
        if(carrito.length == 0){
            res.json({error:'no hay productos cargados'});
        }
        else{
             let render = [];
            carrito.forEach( e => {
                render.push(e.producto);
            })
            
             res.render('table', { productos: render, hayProductos: true });
            
        }                 
        
    }
    catch(error){
        console.log('fallo carrito listar')
    }
})

carritoRouter.get('/listar/:id', async (req, res) =>{
    try{
        carrito = await productos.leer(carrito, 'carrito');   
        if(carrito.length == 0){
            res.json({error:'no hay productos cargados'});
        }
        if(req.params.id - 1 > carrito.length){
            res.json({error:'Id inexistente'});
        }
        else{
            let id = req.params.id;
            let render = [];
            carrito.forEach( e => {
                if(e.id == id){
                    render.push(e.producto);
                    console.log(render)
                }
            })            
            
            res.render('table', { productos: render, hayProductos: true });       
        }                 
        
    }
    catch(error){
        console.log('fallo carrito listar por ID')
    }
})

carritoRouter.delete('/borrar/:id', async (req, res) =>{
    if(carrito.length == 0){
        carrito = await productos.leer(carrito, 'carrito'); 
    }                 
    if(req.params.id > data.length || req.params.id == 0){
        res.json({error:'producto no encontrado'});
    }
    else{
      let borrado = carrito.splice(req.params.id - 1, 1)
      productos.actualizarProductos(carrito, 'carrito');
      let render = [];            
      render.push(borrado[0].producto);                 
      res.render('table', { productos: render , hayProductos: true });
    }    
})




