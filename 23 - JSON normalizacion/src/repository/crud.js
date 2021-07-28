class MongoCRUD {

    constructor(model) {
        this.model = model;
    }

    /**
     * @return entity model.
     */
    getModel() {
        return this.model;
    }

    /**
     * Create a new entity.
     * @param {Object} userData
     */
    async create(data) {
        return this.model.create(data);
    }

    /**
     * Find entity by ID.
     * @param {Number} id
     */
    async findById(num) {
        return this.model.find({id: num});
    }

    /**
     * Find all records
     */
    findAll() {
        return this.model.find({});
    }

    /**
     * Update a entity looking for it by id
     * @param {String} id mongodb id
     * @param {Object} toUpdate data to update
     */
    update(num, toUpdate) {
        return this.model.updateOne({id: num}, toUpdate);
    }

    /**
     * Delete a entity looking for it by id
     * @param {String} id mongodb id
     */
    delete(num) {
        return this.model.deleteOne({id: num});
    }
}

module.exports = MongoCRUD;