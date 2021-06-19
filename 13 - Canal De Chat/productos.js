const { info } = require('console');
const fs = require('fs');

class Productos {

    constructor(title, price, thumbnail, id){        
        this.title = title,
        this.price = price,
        this.thumbnail = thumbnail,
        this.id = id             
    }    

    async leer(lectura, operacion){
        try{
            if(operacion == 'productos')            
            lectura = JSON.parse(await fs.promises.readFile('./productos.txt'));        
            if(operacion == 'mensajes')
            lectura = JSON.parse(await fs.promises.readFile('./mensajes.txt'));                            
            return lectura;
        }
        catch(error){
            console.log('fallo en lectura')
        }       
                
    }
    

   async guardar(data, producto){
    try{
   
        data.push(producto);        
        lectura = JSON.stringify(await fs.promises.writeFile('./productos.txt', JSON.stringify(data, null, '\t')));                                                        
        return data;                 
        
    }
    catch(error){
        console.log('fallo en guardar')
    }       
  }

  async actualizarProductos(data){
    try{  
                
        lectura = await fs.promises.writeFile('./productos.txt', JSON.stringify(data, null, '\t'));                                                        
        return data;                
        
    }
    catch(error){
        console.log('fallo en actualizar producto')
    }       
  }
}

// exporto una instancia de la clase
module.exports = new Productos();

