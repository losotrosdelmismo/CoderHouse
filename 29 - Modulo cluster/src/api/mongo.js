const mensajesModels = require('../models/message');
const productosModels = require('../models/productos');
const carritoModels = require('../models/carrito');
const productos = require('../persistencia/productos.json');
const mensajes = require('../persistencia/mensajes.json');
const { post } = require('../routes/productos');

class Mongo {

    constructor() {}
    //leemos la base de datos y si no estan las creamos
   async leer(base, model, num) {
        
       try{
        if(model === "productos"){
            
            base = await productosModels.find();            
            if(base.length == 0){                
                await productosModels.create(productos);
                base = await productosModels.find(); 
                            
            }
            if(num != null){
                return productosModels.find({id: num}) 
            }    
            return base; 
        }
        if(model === "chat"){
            base = await mensajesModels.find();
            if(base.length == 0){
                await mensajesModels.create(mensajes);
                base = await mensajesModels.find();
               
            }
            if(num != null){
                return mensajesModels.find({id: num}) 
            }
            
            return base; 
        }
        
        if(model === "carrito"){

            if(num != null){
                return carritoModels.find({id: num}) 
            }

            base = await carritoModels.find();

            if(base.length == 0){                
                await carritoModels.create(productos);
                base = await carritoModels.find(); 
                            
            }

            return base; 
        }

        
            
    }catch(error){
     console.log('Error al leer en Mongo:', base, error);
    } 
}

async guardar(data, model) {    
    try{
        let result;
        if(model === "productos"){
            return result = await productosModels.create(data);
            
        }
        if(model === "chat"){
            return result = await mensajesModels.create(data);            
        }
        if(model === "carrito"){
            console.log(data)
           let base = await carritoModels.find();

            if(base.length == 0){                
                await carritoModels.create(productos);
                base = await carritoModels.find();
                data.id = base.length +1;
                return result = await carritoModels.create(data);
                            
            }else{
                data.id = base.length +1;
                return result = await carritoModels.create(data);
            }            
        }
        
    }catch{
        console.log(data)
        console.log("error en guardar MONGO");
    }      
 }


async actualizar(num, toUpdate, model) {
    try{
        if(model === "productos"){
            return productosModels.updateOne({id: num}, { $set: {actualizado: toUpdate}});
        }
        if(model === "chat"){
         return  mensajesModels.updateOne({id: num}, { $set: {date: toUpdate}});          
        }
        if(model === "carrito"){
            return  carritoModels.updateOne({id: num}, { $set: {producto: "Actualizado " + toUpdate}});          
           }
    }catch{
        console.log("error en actualizar MONGO");
    }
    
 }

 async borrar(num, model){
     try{
        if(model === "productos"){
            return productosModels.deleteOne({id: num});
     }
     if(model === "chat"){
        return mensajesModels.deleteOne({id: num});        
     }
     if(model === "carrito"){
        return carritoModels.deleteOne({id: num});        
     }
     }catch{
        console.log("error en borrar MONGO");
    }
   
 }
 async post(data, model){
    let result;

    try{
        if(model === "productos"){
            return result = await productosModels.create(data);
     }
     if(model === "chat"){
        return result = await mensajesModels.create({autor: "metodo@post", date: new Date(), texto: "prueba"});        
     }
    }catch{
        console.log("error en post MONGO")
    }
    
 }
}    


module.exports = Mongo;
            
            

           
       
       
    