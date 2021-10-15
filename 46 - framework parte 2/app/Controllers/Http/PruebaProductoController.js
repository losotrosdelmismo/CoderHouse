'use strict'
const producto = use('App/Models/Producto');

class ProductoController {

    async leer ({ request, response }){
        return await producto.all();
    } 
}

module.exports = ProductoController
