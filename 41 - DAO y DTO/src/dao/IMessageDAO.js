const DaoException = require('../errors/DaoException');

class IMessageDAO {

    constructor() { }

    async leer() {
        throw new DaoException('falta implementar create()');
    }

    async guardar() {
        throw new DaoException('falta implementar findById()');
    }

    async actualizar() {
        throw new DaoException('falta implementar update()');
    }

    async borrar() {
        throw new DaoException('falta implementar remove()');
    }
}

module.exports = IMessageDAO;