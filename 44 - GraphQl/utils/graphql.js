var express = require('express');
var { buildSchema } = require('graphql');
const mongo = require('../api/mongoCrud');
let mongoCrud = new mongo;
const logger = require('../utils/winston');

var schema = buildSchema(`
type Query {
    
    productos: [Producto],
    producto(id: Int!): Producto

},
type Mutation {
    cambiarPrecio(id: Int!, price: Int!): Producto,
    borrarProducto(id: Int!): Producto
},
type Producto {    
        title: String
        price: Int
        thumbnail: String
        id: Int
        actualizado:  String    
    }    
`);

var data = []; //array donde paso los datos

var getProductos = async function (){
    try {
                
        let result = await mongoCrud.leer(data, "productos");
        return result;
    } catch (error) {
        return 'error en productos graphQl ' + error;
    }
}

var getProducto = async function (args){
    let data = []
    try {
                
        let result = await mongoCrud.leer(data, "productos");
        var id = args.id;
    
        return result.filter(producto => {
            return producto.id == id;
        })[0];
       
    } catch (error) {
        return 'error en productos graphQl ' + error;
    }    
}

var cambiarPrecio = async function ({ id, price }) {
    let data = []
    try {
                
        let result = await mongoCrud.leer(data, "productos");
        result.map(producto => {
            if (producto.id === id) {
                producto.price = price;
                return producto;
            }
        });
        
        return result.filter(producto => producto.id === id)[0];

       
    } catch (error) {
        return 'error en productos graphQl ' + error;
    }   
    
}

var borrarProducto = async function ({id}) {
    try {        
        let result = await mongoCrud.borrar(id, "productos");
        return result;
        
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
}

// Root resolver
var root = { 
    cambiarPrecio: cambiarPrecio,
    productos: getProductos,
    producto: getProducto,
    borrarProducto: borrarProducto
};


module.exports = {root, schema};
