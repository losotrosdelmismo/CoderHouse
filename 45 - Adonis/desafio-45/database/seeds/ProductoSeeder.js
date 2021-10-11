'use strict'

/*
|--------------------------------------------------------------------------
| ProductoSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

const producto = use('App/Models/Producto');
const persistencia = require('../../persistencias/productos.json')

class ProductoSeeder {
  async run () {

    await producto.createMany(persistencia)
  }
}

module.exports = ProductoSeeder
