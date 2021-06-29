const { info } = require('console');
const fs = require('fs');

class Productos {

    constructor(title, price, thumbnail, id, timeStamp, codigo, descripcion, stock){        
        this.id = id,
        this.timeStamp = timeStamp,
        this.title = title,
        this.descripcion = descripcion, 
        this.codigo = codigo, 
        this.thumbnail = thumbnail,
        this.price = price,
        this.stock = stock
    }   
   
    async leer(lectura, operacion){
        try{
            if(operacion == 'productos')            
            lectura = JSON.parse(await fs.promises.readFile('./baseDeDatos/productos.json'));        
            if(operacion == 'mensajes')
            lectura = JSON.parse(await fs.promises.readFile('./baseDeDatos/mensajes.txt'));                          
            if(operacion == 'carrito')            
            lectura = JSON.parse(await fs.promises.readFile('./baseDeDatos/carrito.txt'));
            return lectura;
        }
        catch(error){
            console.log('fallo en lectura')
        }       
                
    }
    

   async guardar(data, producto){
    try{
   
        data.push(producto);        
        lectura = JSON.stringify(await fs.promises.writeFile('./baseDeDatos/productos.json', JSON.stringify(data, null, '\t')));                                                        
        return data;                 
        
    }
    catch(error){
        console.log('fallo en guardar')
    }       
  }

  async actualizarProductos(data, operacion){
    try{  
        if(operacion == 'productos')        
        lectura = await fs.promises.writeFile('./baseDeDatos/productos.json', JSON.stringify(data, null, '\t'));
        if(operacion == 'carrito') 
        lectura = await fs.promises.writeFile('./baseDeDatos/carrito.txt', JSON.stringify(data, null, '\t'));                                                            
        return data;                
        
    }
    catch(error){
        console.log('fallo en actualizar producto')
    }       
  }
}

// exporto una instancia de la clase
module.exports = new Productos();

