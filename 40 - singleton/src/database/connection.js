// module of connection to the database.
const mongoose = require('mongoose');
const urlLocal = require('../config/config.json').MONGO_URL_LOCAL;
const urlMongoAtlas = require('../config/config.json').MONGO_URL_EN_MONGO_ATLAS;

//cambiar el objeto por urlLocal o urlMongoAtlas segun que base de datos se quiera usar
const connection = mongoose.connect(urlLocal, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on('connected', () => {
    console.log('[Mongoose Conexion LocalHost] - connected in:', urlLocal);
    console.log('[Mongoose Conexion MongoATLAS] - connected in:', urlMongoAtlas);
});

mongoose.connection.on('error', (err) => {
    console.log('[Mongoose] - error:', err);
});

module.exports = connection;
