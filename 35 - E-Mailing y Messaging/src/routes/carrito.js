const express = require('express');
const router = express.Router();
const factory = require("../repository/factory");
const persistenciaTipo = require("../config/config.json").persistencia; 

var data = []; //array donde paso los datos

router.get('/carrito', async (req, res) =>{
    try {
        
        let Persistencia = factory.getPersistencia(persistenciaTipo);
        let instancia = new Persistencia();
        let result = await instancia.leer(data, "carrito")
        res.json(result);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
})

router.get('/carrito/:id', async (req, res) => {
    try {
        let Persistencia = factory.getPersistencia(persistenciaTipo);
        let instancia = new Persistencia();
        let result = await instancia.leer(data, "carrito", req.params.id)
        res.json(result);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
});

router.post('/carrito', async (req, res) => {
    try {
        let Persistencia = factory.getPersistencia(persistenciaTipo);
        let instancia = new Persistencia();
        let result = await instancia.guardar({timeStamp: new Date().toLocaleString(), producto: "agregado por metodo p@st"}, "carrito")
        return res.json({Agregado: "Articulo agregado desde metodo post", result: result});
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
});

router.put('/carrito/:id', async (req, res) => {
    try {        
            let Persistencia = factory.getPersistencia(persistenciaTipo);
            let instancia = new Persistencia();
            let result = await instancia.actualizar(req.params.id, new Date().toLocaleString(), "carrito");
            return res.json(result);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
});

router.delete('/carrito/:id', async (req, res) => {
    try {
        let Persistencia = factory.getPersistencia(persistenciaTipo);
        let instancia = new Persistencia();
        let result = await instancia.borrar(req.params.id, "carrito");
        return res.json(result);
        
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
});

module.exports = router;