let instance = null;

class PersistenciaFactory {

    constructor() { }

    getPersistencia(tipo) {
        if (!instance) {
        try {
            instance = require(`../api/${tipo}`);
            return instance
        } catch (error) {
            console.log('No se encontro el tipo de persistencia:', tipo, error);
        }
        }
    }
}

module.exports = new PersistenciaFactory();
