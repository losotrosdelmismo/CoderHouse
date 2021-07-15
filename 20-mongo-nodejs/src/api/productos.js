const productos = require('../models/productos');
const MongoCRUD = require('../repository/crud');

class productosController extends MongoCRUD {

    constructor() {
        super(productos);
    }      
    
}

module.exports = new productosController();