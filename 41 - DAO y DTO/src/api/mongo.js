const dao = require('../dao/MessageMongoDao');

class Mongo {

    constructor() {
        this.messageDAO = new dao();
    }
    //leemos la base de datos y si no estan las creamos
   async leer(base, model, num) {
        
    try{
        base =  await this.messageDAO.leer(base, model, num);            
        return base;
            
    }catch(error){
     console.log('Error al leer en Mongo:', base, error);
    } 
}

async guardar(data, model) {    
    try{
        let result;
        return result = await this.messageDAO.guardar(data, model); 
        
    }catch{
        console.log(data)
        console.log("error en guardar MONGO");
    }      
 }


async actualizar(num, toUpdate, model) {
    try{
        return await this.messageDAO.actualizar(num, toUpdate, model);
    }catch{
        console.log("error en actualizar MONGO");
    }
    
 }

 async borrar(num, model){
     try{
        return await this.messageDAO.borrar(num, model);
     }catch{
        console.log("error en borrar MONGO");
    }
   
 }
 
}    


module.exports = Mongo;
            
            

           
       
       
    