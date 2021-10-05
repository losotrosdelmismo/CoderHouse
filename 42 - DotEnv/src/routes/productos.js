const express = require('express');
const router = express.Router();
const factory = require("../repository/factory");
const persistenciaTipo = require("../../config").PERSISTENCIA; 

var data = []; //array donde paso los datos

router.get('/productos', async (req, res) => {
    try {
        
        let Persistencia = factory.getPersistencia(persistenciaTipo);
        let instancia = new Persistencia();
        let result = await instancia.leer(data, "productos")
        res.json(result);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
});

router.get('/productos/:id', async (req, res) => {
    try {
        let Persistencia = factory.getPersistencia(persistenciaTipo);
        let instancia = new Persistencia();
        let result = await instancia.leer(data, "productos", req.params.id)
        res.json(result);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
});

router.post('/productos', async (req, res) => {
    try {
        let Persistencia = factory.getPersistencia(persistenciaTipo);
        let instancia = new Persistencia();
        let result = await instancia.guardar({title: "prueba"}, "productos")
        return res.json({Agregado: "Articulo agregado desde metodo post", result: result});
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
});

router.put('/productos/:id', async (req, res) => {
    try {        
            let Persistencia = factory.getPersistencia(persistenciaTipo);
            let instancia = new Persistencia();
            let result = await instancia.actualizar(req.params.id,  new Date().toLocaleString(), "productos");
            return res.json(result);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
});

router.delete('/productos/:id', async (req, res) => {
    try {
        let Persistencia = factory.getPersistencia(persistenciaTipo);
        let instancia = new Persistencia();
        let result = await instancia.borrar(req.params.id, "productos");
        return res.json(result);
        
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
});

module.exports = router;