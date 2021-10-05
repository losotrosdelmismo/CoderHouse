const express = require('express');
const router = express.Router();
const factory = require("../repository/factory");
const persistenciaTipo = require("../../config").PERSISTENCIA; 

var data = []; //array donde paso los datos

router.get('/messages', async (req, res) => {
    try {        
        let Persistencia = factory.getPersistencia(persistenciaTipo);
        let instancia = new Persistencia();
        let result = await instancia.leer(data, "chat")
        res.json(result);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
});

router.get('/messages/:id', async (req, res) => {
    try {
        let Persistencia = factory.getPersistencia(persistenciaTipo);
        let instancia = new Persistencia();
        let result = await instancia.leer(data, "chat", req.params.id)
        res.json(result);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
});

router.post('/messages', async (req, res) => {
    try {
        let Persistencia = factory.getPersistencia(persistenciaTipo);
        let instancia = new Persistencia();
        let result = await instancia.guardar({autor: "metodo@post", date: new Date().toLocaleString(), texto: "prueba"}, "chat")
        return res.json({Agregado: "Articulo agregado desde metodo post", result: result});
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
});

router.put('/messages/:id', async (req, res) => {
    try {        
        let Persistencia = factory.getPersistencia(persistenciaTipo);
        let instancia = new Persistencia();
        let result = await instancia.actualizar(req.params.id, new Date().toLocaleString(), "chat");
        res.json(result);
} catch (error) {
    return res.status(500).send({ error: error.message });
}
});

router.delete('/messages/:id', async (req, res) => {
    try {
        let Persistencia = factory.getPersistencia(persistenciaTipo);
        let instancia = new Persistencia();
        let result = await instancia.borrar(req.params.id, "chat");
        return res.json(result);
        
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
});

module.exports = router;