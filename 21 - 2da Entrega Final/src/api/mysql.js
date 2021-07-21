const options = require('../config/dataBase');
const knex = require('knex')(options);
const mensajes = require("../persistencia/mensajes.json")
const productos = require("../persistencia/productos.json")

class MySql{

    constructor(){}

    async leer(base, model, num){

        try{

                base = await knex.from(model).select('*');
                
                if(base.length == 0 ){
                    if(model === "productos"){
                    knex(model).insert(productos)
                    .then(() => {
                    console.log('producto agregado');
                    }).catch(error => {
                    console.log('error: tabla no existe, ejecutar crearTablaKnex.js', error);
                    }).finally(() => {
                    console.log('cerrando conexion...');
                    knex.destroy();
                    });                    
                    }
                    
                
                    if(model === "chat"){
                        knex(model).insert(mensajes)
                        .then(() => {
                        console.log('mensaje agregado');
                        }).catch(error => {
                        console.log('error: tabla no existe, ejecutar crearTablaKnex.js', error);
                        }).finally(() => {
                        console.log('cerrando conexion...');
                        knex.destroy();
                        
                    });                  
                    
                    }
                    base = await knex.from(model).select('*');
                    return base;
                }
               
                if(num != null){
                    let result =  await knex.from(model).where({id: num});
                    return result;
                } 

                base = await knex.from(model).select('*');
                return base
          
                
        }catch(error){
         console.log('Error al leer en MySql:', base, error);
        }          
    
    }

   async guardar(data, model) {
    
    try{
        if(model === "carrito"){
         await knex(model).insert(data);
        }
        if(data.length != null){
            let productoNuevo = data.splice(-1);        
            await knex(model).insert(productoNuevo); 
        }else{
            await knex(model).insert(data);
        }      
              
     
        
    }catch{
        console.log('Error al guardar en MySql:', base, error);
    }      
 }

    async actualizar(num, toUpdate, model){
        try{
            let result;
            if(model === "productos"){
              return  result =  await knex(model).where({ id: num }).update({actualizado: toUpdate});
                
            }
            if(model === "chat"){
                return  result =  await knex(model).where({ id: num }).update({date: toUpdate});
                       
            }
            if(model === "carrito"){
                return  result =  await knex(model).where({ id: num }).update({producto: "Actualizado " + toUpdate});
                     
            }    

       
            
        }catch(error){
            console.log("error en actualizar MySql " + error);
        }
    }

    async borrar(num, model){
      await  knex(model)
        .where({ id: num })
        .del()
    }

    async post(model){
    try{
    if(model === "productos")
     return  await knex(model).insert({title: "prueba"}); 
    if(model === "chat")
    return  await knex(model).insert({autor: "postMan", date: new Date(), texto: "prueba"}); 
    if(model === "carrito")
    return  await knex(model).insert({timeStamp: new Date().toLocaleString(), producto: "producto agregado por metodo POST" }); 
    }catch{
        console.log("error en post MySql")
    }}

}

module.exports = MySql;