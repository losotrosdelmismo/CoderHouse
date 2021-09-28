class PersistenciaFactory {

    constructor() { }

    getPersistencia(tipo) {
        try {
            let modulo = require(`../api/${tipo}`);
            return modulo
        } catch (error) {
            console.log('No se encontro el tipo de persistencia:', tipo, error);
        }
    }
}

module.exports = new PersistenciaFactory();
