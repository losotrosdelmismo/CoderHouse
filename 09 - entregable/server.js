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

app.use(express.static('public'));
//Creamos el router
const router = express.Router();
//creamos el use y las rutas
app.use('/api/productos', router);

// completar el codigo...
var data = [];//variable donde guardo los prodcutos

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
    res.json(producto);
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
                title: req.body.title,
                price: req.body.price,
                thumbnail: req.body.thumbnail,
                id: req.params.id     
            } ;
            data[req.params.id - 1] = producto
            productos.actualizarProductos(data);
            res.json(data[req.params.id - 1])
        }         
       
    }
    catch(error){
        console.log('fallo')
    }  
    
    res.json(producto);
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
      res.json(borrado);
    }    
})

// desde postman ingrese: {
// 		"title": "campera",
// 		"price": 1000,
// 		"thumbnail": "unaURL",
// 		"id": 0	
// 	}
//para el put desde postman ingrese: {
// {
//     "title": "Walkman",
//     "price": 1,
//     "thumbnail": "unaURLdeWalkmans"		
// }	
