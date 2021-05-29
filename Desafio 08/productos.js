const { info } = require('console');
const fs = require('fs');

class Productos {

    constructor(title, price, thumbnail, id){        
        this.title = title,
        this.price = price,
        this.thumbnail = thumbnail,
        this.id = id             
    }    

    async leer(lectura){
        try{
            lectura = JSON.parse(await fs.promises.readFile('./productos.txt'));            
            Object.entries(lectura);                                                        
            return lectura;
        }
        catch(error){
            console.log('fallo')
        }       
                
    }

   async guardar(data, producto){
    try{                 
        data.push(producto);        
        lectura = JSON.stringify(await fs.promises.writeFile('./productos.txt', JSON.stringify(data, null, '\t')));                                                        
        return data;
    }
    catch(error){
        console.log('fallo')
    }       
  }
}

// exporto una instancia de la clase
module.exports = new Productos();

