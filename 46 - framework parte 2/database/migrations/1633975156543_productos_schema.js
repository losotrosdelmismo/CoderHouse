'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProductosSchema extends Schema {
  up () {
    this.create('productos', (table) => {
      table.increments();
      table.string('title').notNullable();
      table.integer('price').notNullable();
      table.string('thumbnail').notNullable()
      table.string('actualizado').notNullable();
    })
  }

  down () {
    this.drop('productos')
  }
}

module.exports = ProductosSchema
