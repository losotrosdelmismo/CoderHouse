const express = require('express');
const { async } = require('rxjs');
const productos = require('./productos');
// creo una app de tipo express
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const fs = require('fs');
// pongo a escuchar el servidor en el puerto indicado
const puerto = 8080;

const server = app.listen(puerto, () => {
    console.log(`servidor escuchando en http://localhost:${puerto}`);
});

// en caso de error, avisar
server.on('error', error => {
    console.log('error en el servidor:', error);
});


app.use('/static', express.static(__dirname + 'public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//CONFIGURACOIN PUGS-------------------------------

// indica el directorio donde se almacenaran las plantillas
app.set('views', './views');
// se indica el motor de plantillas a utilizar
app.set('view engine', 'pug');
//FIN-------------------------------

app.use(express.static('public'));
//Creamos el router
const router = express.Router();
//creamos el use y las rutas
app.use('/api/productos', router);

// completar el codigo...
var data = [];//variable donde guardo los prodcutos
//RUTA NUEVA MAS PRACTICO
app.get('/', async (req, res) => {
    data = await productos.leer(data);
        if(data.length == 0){
            res.render('layouts.pug', { productos: data , hayProductos: false });
        }
        else{
           
            res.render('layouts.pug', { productos: data , hayProductos: true });
           
        }
});

//rutas de la consigna de handleBars
router.get('/vista', async (req, res) => {
	try{
        data = await productos.leer(data);
        if(data.length == 0){
            res.send('NO HAY PRODUCTOS');
        }
        else{
           
            res.render('layouts.pug', { productos: data , hayProductos: true });
           
        }                 
        
    }
    catch(error){
        console.log('fallo')
    }
    
});

router.get('/listar', async (req, res) =>{    
    try{
        data = await productos.leer(data);
        if(data.length == 0){
            res.json({error:'no hay productos cargados'});
        }
        else{
            res.json(data)
        }                 
        
    }
    catch(error){
        console.log('fallo')
    }
})

router.get('/listar/:id', async (req, res) =>{    
    try{
        if(data.length == 0){
            data = await productos.leer(data);
        }        
        if(req.params.id > data.length || req.params.id == 0){
            res.json({error:'producto no encontrado'});
        }
        else{
            res.json(data[req.params.id - 1])
        }         
       
    }
    catch(error){
        console.log('fallo')
    }
})
       
router.post('/guardar', async (req, res) =>{    
    if(data.length == 0){
        data = await productos.leer(data);
    }   
    
    let producto = req.body;    
    producto.id = data.length + 1
    p = await productos.guardar(data, producto);    
    res.redirect('/');
})

router.put('/actualizar/:id', async (req, res) =>{
    try{
        if(data.length == 0){
            data = await productos.leer(data);
        }        
        if(req.params.id > data.length || req.params.id == 0){
            res.json({error:'producto no encontrado'});
        }
        else{
            producto ={
                actualizado: Date(),
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
            
            productos.actualizarProductos(data);            
            res.redirect('/');
        }         
       
    }
    catch(error){
        console.log('fallo')
    }  
    
    
})

router.delete('/borrar/:id', async (req, res) =>{
    if(data.length == 0){
        data = await productos.leer(data);
    }                 
    if(req.params.id > data.length || req.params.id == 0){
        res.json({error:'producto no encontrado'});
    }
    else{
      let borrado = data.splice(req.params.id - 1, 1)
      productos.actualizarProductos(data)
      res.render('layouts.pug', { productos: borrado , hayProductos: true });
    }    
})