const express = require('express');
const { async } = require('rxjs');
const productos = require('./productos');
// creo una app de tipo express
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// pongo a escuchar el servidor en el puerto indicado
const puerto = 8080;

const server = app.listen(puerto, () => {
    console.log(`servidor escuchando en http://localhost:${puerto}`);
});

// en caso de error, avisar
server.on('error', error => {
    console.log('error en el servidor:', error);
});

// completar el codigo...
var data = [];//variable donde guardo los prodcutos

app.get('/productos/listar', async (req, res) =>{    
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

app.get('/productos/listar/:id', async (req, res) =>{    
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
       
app.post('/productos/guardar', async (req, res) =>{
    if(data.length == 0){
        data = await productos.leer(data);
    }   
    
    let producto = req.body;
    producto.id = data.length + 1
    p = await productos.guardar(data, producto);    
    res.json(producto);
})

//desde postman ingrese: {
	// 	"title": "campera",
	// 	"price": 1000,
	// 	"thumbnail": "unaURL",
	// 	"id": 0	
	// }
